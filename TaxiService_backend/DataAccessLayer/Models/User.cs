using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public UserType UserTypes { get; set; } // Može biti "Administrator", "Korisnik", ili "Vozač"
        public string ProfilePicture { get; set; }
        public VerifiedStatus IsVerified { get; set; }
    }
}
