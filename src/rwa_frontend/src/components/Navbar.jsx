import React from "react";

const NavbarLinks =[
    {
        title:'Marketplace',
        goto: '/'
    }, {
        title: 'Tokenize Asset',
        goto: '/'
    },
     {
        title: 'Portfolio',
        goto: '/'
    }, {
        title: 'Trading',
        goto: '/'
    },
]

const Navbar = () => {
  return (
    <div className="w-full h-20 ">
      <div className="max-w-[100rem] mx-auto  flex justify-between items-center px-8 py-2">
        <div>
          <h1 className="text-4xl text-sky-500 font-semibold">RWAKEN</h1>
        </div>
        <div className="py-2 px-12 rounded-4xl flex  gap-16 text-xl">
          {
            NavbarLinks.map((item, i) => (
                <a key={i} href={item.href} className="hover:text-sky-600 cursor-pointer transition-all ease-in-out duration-300" >
                    {item.title}
                </a>
            ))
          }
        </div>
        <div>
          <button className="bg-orange-500 text-neutral-100 px-4 py-2 rounded-xl font-medium">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
