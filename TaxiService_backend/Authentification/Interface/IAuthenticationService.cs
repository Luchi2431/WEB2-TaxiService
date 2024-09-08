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

        Task<UserDTO> GetUserProfileAsync(int userId);

        Task<ProfileDTO> LoginUser(LoginDTO loginDTO);
    }
}
