using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DTO
{
    public class VerificationRequestDTO
    {
        public int Id { get; set; }
        public int DriverId { get; set; } // ID vozača
        public bool IsApproved { get; set; } // Da li je verifikacija odobrena
        public DateTime RequestedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }
}
