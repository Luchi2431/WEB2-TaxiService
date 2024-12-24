using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaxiService_backend
{
    public interface IRideService
    {
        Task<RideDTO> EstimateRideAsync(string startAddress, string endAddress);
        Task<Ride> ConfirmRideAsync(RideDTO rideDto);
        Task<List<RideDTO>> GetNewRidesAsync();
        Task<RideDTO> AcceptRideAsync(int rideId, int driverId);

        Task<List<RideDTO>> GetPreviousRidesAsync(int id);

        Task<List<RideDTO>> GetMyRidesAsync(int id);

        Task<List<RideDTO>> GetAllRidesAsync();
    }
}
