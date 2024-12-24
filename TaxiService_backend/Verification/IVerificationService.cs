using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Verification
{
    public interface IVerificationService
    {
        Task<bool> ApproveDriverAsync(int driverId);

        Task<bool> RejectDriverAsync(int driverId);
    }
}
