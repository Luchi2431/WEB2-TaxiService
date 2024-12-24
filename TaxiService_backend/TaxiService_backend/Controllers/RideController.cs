using DataAccessLayer.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaxiService_backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/ride")]
    public class RideController : Controller
    {
        private readonly IRideService _rideService;

        public RideController(IRideService rideService)
        {
            _rideService = rideService;
        }

        [Authorize]
        [HttpPost("estimate")]
        public async Task<IActionResult> EstimateRide(string startAddress, string endAddress)
        {
            try
            {
                var estimate = await _rideService.EstimateRideAsync(startAddress, endAddress);
                return Ok(estimate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmRide([FromForm] RideDTO rideDto)
        {
            try
            {
                if (TimeSpan.TryParse(rideDto.EstimatedTime.ToString(), out TimeSpan estimatedTime))
                {
                    // Sada možeš da koristiš estimatedTime
                    rideDto.EstimatedTime = estimatedTime;
                }
                else
                {
                    // Obradi grešku ako ne možeš da konvertuješ
                    return BadRequest("Invalid time format.");
                }
                var ride = await _rideService.ConfirmRideAsync(rideDto);
                return Ok(new { Message = "Ride confirmed", Ride = ride });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("new-rides")]
        public async Task<IActionResult> GetNewRides()
        {
            try
            {
                var newRides = await _rideService.GetNewRidesAsync();
                return Ok(newRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [Authorize]
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptRide(AcceptRideRequestDTO acceptRideDTO)
        {
            try
            {
                var success = await _rideService.AcceptRideAsync(acceptRideDTO.RideId, acceptRideDTO.DriverId);
                if (success == null)
                {
                    return BadRequest(new { Message = "Vožnja nije pronađena ili je već prihvaćena." });
                }

                return Ok(success);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("previousRides")]
        public async Task<IActionResult> GetPreviousRides(int id)
        {
            try
            {
                var previousRides = await _rideService.GetPreviousRidesAsync(id);
                return Ok(previousRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("my-rides")]
        public async Task<IActionResult> GetMyRides(int id)
        {
            try
            {
                var myRides = await _rideService.GetMyRidesAsync(id);
                return Ok(myRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("all-rides")]
        public async Task<IActionResult> GetAllRides()
        {
            try
            {
                var allRides = await _rideService.GetAllRidesAsync();
                return Ok(allRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}

