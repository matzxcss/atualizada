import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import taycan1 from "@/assets/porsche-taycan/porsche-2.jpeg";
import taycan2 from "@/assets/porsche-taycan/porsche-3.jpeg";
import taycan3 from "@/assets/porsche-taycan/porsche-4.jpeg";
import taycan4 from "@/assets/porsche-taycan/porsche-5.jpeg";
import taycan5 from "@/assets/porsche-taycan/porsche-6.jpeg";
import taycan6 from "@/assets/porsche-taycan/porsche-hero.jpeg";

const PorscheGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const images = [
    { src: taycan1, alt: "Porsche Taycan 2025", title: "" },
    { src: taycan2, alt: "Porsche Taycan 2025", title: "" },
    { src: taycan3, alt: "Porsche Taycan 2025", title: "" },
    { src: taycan4, alt: "Porsche Taycan 2025", title: "" },
    { src: taycan5, alt: "Porsche Taycan 2025", title: "" },
    { src: taycan6, alt: "Porsche Taycan 2025", title: "" },
  ];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  return (
         <section className="py-8 md:py-16 bg-gradient-to-b from-background to-muted/20">
       <div className="container mx-auto px-4">
         <div className="text-center mb-8 md:mb-12">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
             Conheça o <span className="text-gradient-gold">Porsche Taycan 2025</span>
           </h2>
           <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
             Descubra a elegância, performance e sofisticação do prêmio que pode ser seu
           </p>
         </div>

                 {/* Gallery Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setSelectedImage(index)}
            >
                             <img
                 src={image.src}
                 alt={image.alt}
                 className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
               />
                             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <div className="text-white text-center">
                   <div className="text-sm">Clique para ampliar</div>
                 </div>
               </div>
            </div>
          ))}
        </div>

                 {/* Car Specifications */}
         <div className="bg-card rounded-2xl p-4 md:p-8 shadow-[var(--shadow-elegant)] border border-border">
           <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 md:mb-6">
             Especificações do <span className="text-gradient-gold">Porsche Taycan 2025</span>
           </h3>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                         <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 md:mb-2">0-100 km/h</div>
               <div className="text-sm sm:text-base text-muted-foreground">2.8 segundos</div>
             </div>
             <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 md:mb-2">Velocidade Máxima</div>
               <div className="text-sm sm:text-base text-muted-foreground">260 km/h</div>
             </div>
             <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 md:mb-2">Potência</div>
               <div className="text-sm sm:text-base text-muted-foreground">476 cv</div>
             </div>
             <div className="text-center">
               <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 md:mb-2">Autonomia</div>
               <div className="text-sm sm:text-base text-muted-foreground">484 km</div>
             </div>
          </div>
          
                     {/* Especificações adicionais */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                         <div className="text-center">
               <div className="text-xl sm:text-2xl font-bold text-primary mb-1 md:mb-2">Torque</div>
               <div className="text-sm sm:text-base text-muted-foreground">650 Nm</div>
             </div>
             <div className="text-center">
               <div className="text-xl sm:text-2xl font-bold text-primary mb-1 md:mb-2">Bateria</div>
               <div className="text-sm sm:text-base text-muted-foreground">93.4 kWh</div>
             </div>
             <div className="text-center">
               <div className="text-xl sm:text-2xl font-bold text-primary mb-1 md:mb-2">Carregamento</div>
               <div className="text-sm sm:text-base text-muted-foreground">270 kW</div>
             </div>
          </div>
        </div>

                 {/* Recursos e Tecnologia */}
         <div className="bg-card rounded-2xl p-4 md:p-8 shadow-[var(--shadow-elegant)] border border-border mt-6 md:mt-8">
           <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 md:mb-6">
             Recursos e <span className="text-gradient-gold">Tecnologia</span>
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                         <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
               <div className="text-3xl md:text-4xl mb-2">⚡</div>
               <div className="font-bold mb-1 text-sm md:text-base">Tecnologia Elétrica</div>
               <div className="text-xs md:text-sm text-muted-foreground">Sistema de tração elétrica de última geração</div>
             </div>
             <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
               <div className="text-3xl md:text-4xl mb-2">🎛️</div>
               <div className="font-bold mb-1 text-sm md:text-base">PCM 6.0</div>
               <div className="text-xs md:text-sm text-muted-foreground">Sistema de infotainment avançado</div>
             </div>
             <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
               <div className="text-3xl md:text-4xl mb-2">🔋</div>
               <div className="font-bold mb-1 text-sm md:text-base">Carregamento Rápido</div>
               <div className="text-xs md:text-sm text-muted-foreground">Até 270 kW de potência de carregamento</div>
             </div>
             <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
               <div className="text-3xl md:text-4xl mb-2">🛡️</div>
               <div className="font-bold mb-1 text-sm md:text-base">Segurança Total</div>
               <div className="text-xs md:text-sm text-muted-foreground">Sistemas de assistência ao motorista</div>
             </div>
          </div>
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="relative">
                <img
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
                             <div className="text-center mt-4">
                 <div className="text-gray-300 text-sm">
                   {selectedImage + 1} de {images.length}
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PorscheGallery;
