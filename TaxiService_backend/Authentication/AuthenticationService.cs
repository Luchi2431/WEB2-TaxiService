using AutoMapper;
using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using DataAccessLayer.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
       

        public AuthenticationService(IUserRepository userRepository, Microsoft.Extensions.Configuration.IConfiguration configuration, IMapper mapper)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _mapper = mapper;
            _secretKey = _configuration["SecretKey"];
        }

        public async Task<string> SaveImageAsync(IFormFile image)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return "/Images/" + uniqueFileName;
        }




        public async Task<User> RegisterUserAsync(RegisterDTO registerDto, IFormFile image)
        {
            // Validacija podataka
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                throw new Exception("Lozinke se ne poklapaju");
            }

            if (image == null)
            {
                throw new Exception("Slika je null");
            }

            // Hashovanje lozinke
            var passwordHash = Hash.HashPassword(registerDto.Password);
            var imagePath = await SaveImageAsync(image);




            // Kreiranje korisnika
            var user = new UserDTO
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                DateOfBirth = registerDto.DateOfBirth,
                Address = registerDto.Address,
                UserTypes = registerDto.UserTypes,
                ProfilePicture = imagePath, // Putanja do slike
                IsVerified = VerifiedStatus.InProgress
            };

            return _userRepository.AddUser(user);
        }


        public async Task<User> RegisterOrLoginWithGoogleAsync(string idToken, UserType userType)
        {
            try
            {
                // Verifikuj Google token
                var validPayload = await GoogleJsonWebSignature.ValidateAsync(idToken);

                // Preuzmi podatke korisnika iz tokena
                var email = validPayload.Email;
                var fullName = validPayload.Name;
                var surname = validPayload.FamilyName;
                var firstname = validPayload.GivenName;
                var profilePic = validPayload.Picture;



                // Proveri da li korisnik već postoji u bazi
                var user = _userRepository.FindUser(email);

                if (user == null)
                {
                    // Ako korisnik ne postoji, registruj ga
                    var newUser = new UserDTO
                    {
                        Username = fullName,
                        FirstName = firstname,
                        Email = email,
                        LastName = surname,
                        ProfilePicture = profilePic,
                        UserTypes = userType

                        // Dodaj dodatne podatke o korisniku ako je potrebno
                    };

                    return _userRepository.AddUser(newUser);
                }

                return user; // Vrati korisnika (postojećeg ili novog)
            }
            catch (Exception ex)
            {
                throw new Exception("Nevalidan Google token ili korisnik ne može biti kreiran.");
            }
        }

        public async Task<ProfileDTO> LoginWithGoogleAsync(string token)
        {
            try
            {
                // Verifikuj Google token
                var validPayload = await GoogleJsonWebSignature.ValidateAsync(token);

                // Preuzmi podatke korisnika iz tokena
                var email = validPayload.Email;
                var fullName = validPayload.Name;
                var surname = validPayload.FamilyName;
                var firstname = validPayload.GivenName;

                User u = _userRepository.FindUser(email);
                if (u != null)
                {
                    List<Claim> claims = new List<Claim>();
                    if (u.UserTypes == UserType.User)
                        claims.Add(new Claim("UserType", "User"));
                    if (u.UserTypes == UserType.Driver)
                        claims.Add(new Claim("UserType", "Driver"));
                    if (u.UserTypes == UserType.Admin)
                        claims.Add(new Claim("UserType", "Admin"));


                    SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));

                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                    var tokeOptions = new JwtSecurityToken(
                        issuer: "http://localhost:44334",
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(20),
                        signingCredentials: signinCredentials
                    );
                    string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);


                    ProfileDTO p = _mapper.Map<ProfileDTO>(u);
                    p.Token = tokenString;
                    p.UserType = u.UserTypes;
                    p.ProfilePicture = u.ProfilePicture;

                    return p;
                }
                else
                {
                    throw new Exception("Korisnik nije pronađen");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Nevalidan Google token ili korisnik ne može biti kreiran.");
            }
        }




        public async Task<ProfileDTO> LoginUser(LoginDTO loginDTO)
        {
            try
            {
                User u = _userRepository.FindUser(loginDTO.Email);
                var hashedPassword = Hash.HashPassword(loginDTO.Password);
                if (u != null)
                {
                    if (string.Equals(u.PasswordHash, hashedPassword, StringComparison.Ordinal))
                    {
                        List<Claim> claims = new List<Claim>();
                        if (u.UserTypes == UserType.User)
                            claims.Add(new Claim("UserType", "User"));
                        if (u.UserTypes == UserType.Driver)
                            claims.Add(new Claim("UserType", "Driver"));
                        if (u.UserTypes == UserType.Admin)
                            claims.Add(new Claim("UserType", "Admin"));


                        SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));

                        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                        var tokeOptions = new JwtSecurityToken(
                            issuer: "http://localhost:44334",
                            claims: claims,
                            expires: DateTime.Now.AddMinutes(20),
                            signingCredentials: signinCredentials
                        );
                        string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);


                        ProfileDTO p = _mapper.Map<ProfileDTO>(u);
                        p.Token = tokenString;
                        p.UserType = u.UserTypes;
                        p.ProfilePicture = u.ProfilePicture;
                        return p;
                    }
                    else
                    {
                        throw new Exception("Neispravna lozinka");
                    }
                }
                else
                {
                    throw new Exception("Korisnik nije pronađen");
                }
            }
            catch (Exception ex)
            {
                // Možeš dodati logovanje greške ovde
                Console.WriteLine($"Greška prilikom prijavljivanja: {ex.Message} {ex.StackTrace}");
                throw new Exception($"Greška prilikom prijavljivanja: {ex.Message} {ex.StackTrace}");
            }
        }


    }

}
