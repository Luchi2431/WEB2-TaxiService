using DataAccessLayer.DTO;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserService
{
    public interface IUserService
    {
        Task<string> SaveImageAsync(IFormFile image);
        Task<ProfileDTO> UpdateUserProfileAsync(ProfileDTO profileDTO, IFormFile? profilePicture);
        Task<ProfileDTO> GetUserProfileAsync(int userId);
        Task<List<UserDTO>> GetDriversAsync();
    }
}
