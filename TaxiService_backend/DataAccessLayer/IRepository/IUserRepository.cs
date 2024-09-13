using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.IRepository
{
    public interface IUserRepository
    {
        User AddUser(UserDTO newUser);

        Task<User> GetUserByIdAsync(int userId);

        ProfileDTO UpdateUserAsync(User newUser);

        User FindUser(string email);

        Task<List<User>> GetUsersByTypeAsync(UserType userType);
    }
}
