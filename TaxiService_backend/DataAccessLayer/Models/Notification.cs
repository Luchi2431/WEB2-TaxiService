using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; } // ID korisnika koji prima notifikaciju
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
