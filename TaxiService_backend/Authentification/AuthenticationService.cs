using Authentication.Interface;
using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using System;
using System.Threading.Tasks;
using Common;
using System.IO;
using Microsoft.AspNetCore.Http;
using DataAccessLayer.IRepository;
using Google.Apis.Auth;
using DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using Microsoft.Extensions.Configuration;
    
namespace Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ApplicationDbContext _db;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        //private readonly IUserService _userService;
        //private readonly INotificationService _notificationService;

        public AuthenticationService(ApplicationDbContext db, IUserRepository userRepository, Microsoft.Extensions.Configuration.IConfiguration configuration, IMapper mapper)
        {
            _db = db;
            _userRepository = userRepository;
            _configuration = configuration;
            _mapper = mapper;
            _secretKey = _configuration["SecretKey"];
        }

        public async Task<string> SaveImageAsync(IFormFile image)
        {
            var uploadsFolder = $"C:\\Users\\Zdravo\\OneDrive\\Desktop\\WEB2Projekat\\Web2Projekat-master\\Web2Projekat-master\\TaxiService_backend\\Common\\Images\\";

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


        public async Task<User> RegisterOrLoginWithGoogleAsync(string idToken,UserType userType)
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
                var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    // Ako korisnik ne postoji, registruj ga
                    user = new User
                    {
                        Username = fullName,
                        FirstName = firstname,
                        Email = email,
                        LastName = surname,
                        ProfilePicture = profilePic,
                        UserTypes = userType

                        // Dodaj dodatne podatke o korisniku ako je potrebno
                    };

                    _db.Users.Add(user);
                    await _db.SaveChangesAsync();
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
                        issuer: "http://localhost:44310",
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


        public async Task<ProfileDTO> UpdateUserProfileAsync(ProfileDTO profileDTO, IFormFile? profilePicture)
        {
            // Pronalaženje korisnika na osnovu ID-ja
            var user = await _userRepository.GetUserByIdAsync(profileDTO.Id);

            if (user == null)
            {
                throw new Exception("Korisnik nije pronađen");
            }


            user.Username = profileDTO.Username;
            user.Email = profileDTO.Email;
            user.FirstName = profileDTO.FirstName;
            user.LastName = profileDTO.LastName;
            user.DateOfBirth = profileDTO.DateOfBirth;
            user.Address = profileDTO.Address;



            // Ako je slika profilne slike prisutna, ažurirajte je
            if (profilePicture != null)
            {
                var imagePath = await SaveImageAsync(profilePicture);
                user.ProfilePicture = imagePath;
            }

           return  _userRepository.UpdateUserAsync(user);

        }



        public async Task<ProfileDTO> GetUserProfileAsync(int userId) 
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            Console.WriteLine(user);
            if (user == null)
            {
                return null;
            }

            return new ProfileDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address,
                ProfilePicture = user.ProfilePicture,
                UserType = user.UserTypes,
                IsVerified = user.IsVerified
            };
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
                            issuer: "http://localhost:44310",
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


        #region Verification

        //Funkcija za odobravanje vozača
        public async Task<bool> ApproveDriverAsync(int driverId)
        {
            // Pronađi vozača po ID-ju
            var driver = await _userRepository.GetUserByIdAsync(driverId);

            if (driver == null || driver.UserTypes != UserType.Driver || driver.IsVerified != VerifiedStatus.InProgress)
            {
                return false; // Vozač nije pronađen ili nije vozač ili status nije "InProgress"
            }

            // Ažuriraj status verifikacije vozača
            driver.IsVerified = VerifiedStatus.Verified; // Verifikovan

            // Sačuvaj promene u bazi podataka
            ProfileDTO updatedDriver = _userRepository.UpdateUserAsync(driver);

            return true;
        }

        // Funkcija za odbijanje vozača
        public async Task<bool> RejectDriverAsync(int driverId)
        {
            // Pronađi vozača po ID-ju
            var driver = await _userRepository.GetUserByIdAsync(driverId);

            if (driver == null || driver.UserTypes != UserType.Driver || driver.IsVerified != VerifiedStatus.InProgress)
            {
                return false; // Vozač nije pronađen ili nije vozač ili status nije "InProgress"
            }


            // Ažuriraj status verifikacije vozača
            driver.IsVerified = VerifiedStatus.Denied; // Odbijen

            // Sačuvaj promene u bazi podataka
            ProfileDTO updatedDriver = _userRepository.UpdateUserAsync(driver);

            return true;
        }

        public async Task<List<UserDTO>> GetDriversAsync()
        {
            var drivers = await _userRepository.GetUsersByTypeAsync(UserType.Driver);

            // Mapiranje vozača u DTO format
            var driverDtos = _mapper.Map<List<UserDTO>>(drivers);

            return driverDtos;
        }

        #endregion
    }
}
