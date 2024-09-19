using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DTO
{
    public class AcceptRideRequestDTO
    {
        public int RideId { get; set; }
        public int DriverId { get; set; }
    }
}
