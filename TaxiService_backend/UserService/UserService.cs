using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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

            return _userRepository.UpdateUserAsync(user);

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

        public async Task<List<UserDTO>> GetDriversAsync()
        {
            return _userRepository.GetUsersByTypeAsync(UserType.Driver);
        }
    }

}
