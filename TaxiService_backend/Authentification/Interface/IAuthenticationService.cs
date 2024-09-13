using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Authentication.Interface
{
    public interface IAuthenticationService
    {
        Task<User> RegisterUserAsync(RegisterDTO userDto, IFormFile image);
        // Ostale metode kao što je Login, etc.

        Task<string> SaveImageAsync(IFormFile image);

        Task<User> RegisterOrLoginWithGoogleAsync(string idToken,UserType userType);

        Task<ProfileDTO> GetUserProfileAsync(int userId);

        Task<ProfileDTO> UpdateUserProfileAsync(ProfileDTO profileDTO, IFormFile? profilePicture);

        Task<ProfileDTO> LoginUser(LoginDTO loginDTO);

        Task<ProfileDTO> LoginWithGoogleAsync(string token);

        Task<List<UserDTO>> GetDriversAsync();

        Task<bool> RejectDriverAsync(int driverId);

        Task<bool> ApproveDriverAsync(int driverId);
    }
}
