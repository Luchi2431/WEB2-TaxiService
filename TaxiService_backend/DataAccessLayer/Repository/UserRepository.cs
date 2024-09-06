using AutoMapper;
using DataAccessLayer.Context;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using DataAccessLayer.Models;
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
    }
}
