/* eslint-disable @next/next/no-img-element */
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/lib/config";

export function TestimonialSection() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="flex flex-col items-center justify-center w-full"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
          What Our Customers Say
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Real feedback from real users who love our platform
        </p>
      </SectionHeader>
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-accent"
            >
              <div className="text-muted-foreground italic">
                {testimonial.description}
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
