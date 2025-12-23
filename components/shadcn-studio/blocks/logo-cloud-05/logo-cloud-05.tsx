type brandLogos = {
  image: string
  name: string
}

const LogoCloud = ({ brandLogos }: { brandLogos: brandLogos[] }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <p className='text-primary text-sm font-medium uppercase'>Trusted by Global Leaders</p>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            Global leaders rely on us to power their business growth.
          </h2>
          <p className='text-muted-foreground text-xl'>A diverse network of forward-thinking companies.</p>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-x-10 gap-y-6'>
          {brandLogos.map((logo, index) => (
            <img key={index} src={logo.image} alt={logo.name} className='h-7' />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LogoCloud
