using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class Ride
    {
        public int Id { get; set; }
        public int UserId { get; set; } // ID korisnika koji je naručio vožnju
        public int DriverId { get; set; } // ID vozača koji prihvatio vožnju
        public string StartAddress { get; set; }
        public string EndAddress { get; set; }
        public decimal EstimatedPrice { get; set; }
        public TimeSpan EstimatedTime { get; set; }
        public TimeSpan EstimatedArrivalTime { get; set; }
        public RideStatus RideStatus { get; set; } // Enum za status vožnje
        public DateTime CreatedAt { get; set; }
        public int Rating { get; set; } // Ocena vozača
    }
}
