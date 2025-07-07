import { ChartLine, Globe, Shield, Users } from 'lucide-react'
import React from 'react'


const StatsSection = () => {
  return (
    <div className='py-20 flex justify-around items-center border-y border-neutral-200'>
        <div className='flex flex-col gap-2 items-center'>
            <div className='text-sky-500 text-5xl'>
                <ChartLine size={64} />
            </div>
            <h3 className='text-3xl font-bold'>
                $2.4 M
            </h3>
            <p className='text-neutral-700'>
                Total Assets Tokenized
            </p>
        </div>
        <div className='flex flex-col gap-2 items-center'>
            <div className='text-sky-500 text-5xl'>
                <Users size={64} />
            </div>
            <h3 className='text-3xl font-bold'>
                12,250
            </h3>
            <p className='text-neutral-700'>
                Active Investors
            </p>
        </div>
        <div className='flex flex-col gap-2 items-center'>
            <div className='text-sky-500 text-5xl'>
                <Globe size={64} />
            </div>
            <h3 className='text-3xl font-bold'>
                45
            </h3>
            <p className='text-neutral-700'>
                Countries Supported
            </p>
        </div>
        <div className='flex flex-col gap-2 items-center'>
            <div className='text-sky-500 text-5xl'>
                <Shield size={64} />
            </div>
            <h3 className='text-3xl font-bold'>
                AAA
            </h3>
            <p className='text-neutral-700'>
                Security Rating
            </p>
        </div>
        

        
    </div>
  )
}

export default StatsSection