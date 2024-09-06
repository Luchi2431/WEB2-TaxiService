using Authentication.Interface;
using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using System;
using System.Threading.Tasks;
using Common;
using System.IO;
using Microsoft.AspNetCore.Http;
using DataAccessLayer.IRepository;

namespace Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        //private readonly IUserService _userService;
        //private readonly INotificationService _notificationService;

        public AuthenticationService(IUserRepository userRepository/*IUserService userService, INotificationService notificationService*/)
        {
            _userRepository = userRepository;
            //_userService = userService;
            //_notificationService = notificationService;
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
                IsVerified = false
            };

            return _userRepository.AddUser(user);


        }
    }
}
