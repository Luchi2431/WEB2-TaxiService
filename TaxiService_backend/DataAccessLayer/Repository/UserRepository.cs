using AutoMapper;
using DataAccessLayer.Context;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repository
{
    public class UserRepository : IUserRepository
    {
        private ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public UserRepository(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public User AddUser(UserDTO newUser)
        {
            User user = _mapper.Map<User>(newUser);
            _db.Users.Add(user);
            _db.SaveChanges();

            return _mapper.Map<User>(user); //Dobra je praksa vratiti kreirani objekat nazad,
                                                     //narocito ako se auto generise ID
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _db.Users.FindAsync(userId);
        }

        public ProfileDTO UpdateUserAsync(User newUser)
        {
           
            _db.Users.Update(newUser);
            _db.SaveChanges();

            return _mapper.Map<ProfileDTO>(newUser);

        }


        public User FindUser(string email)
        {
            return _db.Users.FirstOrDefault(user => user.Email == email);
   
        }
    }
}
