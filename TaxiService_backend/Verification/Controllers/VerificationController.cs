using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Verification.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/verification")]
    public class VerificationController : Controller
    {
        private readonly IVerificationService _verificationService;

        public VerificationController(IVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        [HttpPut("approve")]
        [Authorize]
        public async Task<IActionResult> ApproveDriver(int id)
        {
            try
            {
                bool success = await _verificationService.ApproveDriverAsync(id);
                if (!success)
                {
                    return BadRequest(new { Message = "Vozač nije pronađen, nije vozač ili je već odobren." });
                }

                return Ok(new { Message = "Vozač uspešno odobren." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("reject")]
        [Authorize]
        public async Task<IActionResult> RejectDriver(int id)
        {
            try
            {
                bool success = await _verificationService.RejectDriverAsync(id);
                if (!success)
                {
                    return BadRequest(new { Message = "Vozač nije pronađen, nije vozač ili je već odbijen." });
                }

                return Ok(new { Message = "Vozač uspešno odbijen." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

}
