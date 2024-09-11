using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;

namespace DataAccessLayer.DTO
{
    public class ProfileDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Token { get; set; }
        public UserType UserType { get; set; }
        public VerifiedStatus IsVerified { get; set; }
        public string ProfilePicture { get; set; }

    }
}
