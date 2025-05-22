"use client";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Outfit, Syne } from "next/font/google";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  FiShoppingCart,
  FiSearch,
  FiArrowLeft,
  FiStar,
  FiInstagram,
  FiTwitter,
  FiShoppingBag,
} from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { Toaster, toast } from "sonner";

const outfit = Outfit({ subsets: ["latin"] });
const syne = Syne({ subsets: ["latin"] });

interface Painting {
  id: number;
  name: string;
  price: number;
  image: string;
  artist: string;
  description: string;
  year?: string;
  medium?: string;
}

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  title: string;
  date: string;
}

const paintings: Painting[] = [
  {
    id: 1,
    name: "Starry Dreams",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
    artist: "Vincent Modern",
    description:
      "A contemporary take on the night sky, with swirling stars and nebulae in vibrant digital hues. This piece blends traditional artistry with modern tech.",
    year: "2023",
    medium: "Digital Art",
  },
  {
    id: 2,
    name: "Abstract Thoughts",
    price: 890,
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80",
    artist: "Sarah Williams",
    description:
      "Explore the human mind through abstract shapes and colors, evoking deep emotions and intangible thoughts. A dynamic palette represents the fluidity of inner worlds.",
    year: "2022",
    medium: "Oil on Canvas",
  },
  {
    id: 3,
    name: "Ocean Whispers",
    price: 950,
    image:
      "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Michael Blue",
    description:
      "A serene depiction of the ocean, capturing its gentle waves and calming whispers through soothing watercolors.",
    year: "2021",
    medium: "Watercolor",
  },
  {
    id: 4,
    name: "Urban Poetry",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1989&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Emma Stone",
    description:
      "Vibrant city life in a poetic visual narrative. Bold graphics and sharp light capture the rhythm of metropolitan existence.",
    year: "2020",
    medium: "Acrylic",
  },
  {
    id: 5,
    name: "Neon Nights",
    price: 1300,
    image:
      "https://images.unsplash.com/photo-1575396574188-ccf23d32d4b8?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Alex Neon",
    description:
      "Dazzling neon lights and urban nightlife, capturing the city's energetic vibrancy after dark. An ode to nocturnal metropolitan beauty.",
    year: "2023",
    medium: "Digital Art",
  },
  {
    id: 6,
    name: "Digital Dreams",
    price: 780,
    image:
      "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=800&q=80",
    artist: "Tech Artist",
    description:
      "A futuristic vision of dreams in the digital age, blending technology and imagination through mixed media.",
    year: "2022",
    medium: "Mixed Media",
  },
  {
    id: 7,
    name: "Nature's Canvas",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1574184180347-527304c53004?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Flora Smith",
    description:
      "A breathtaking oil painting celebrating nature's beauty, showcasing its rich colors and diverse textures in a stunning composition.",
    year: "2021",
    medium: "Oil on Canvas",
  },
  {
    id: 8,
    name: "Cosmic Journey",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1570569977384-be17f90f1a10?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Space Walker",
    description:
      "An artistic voyage through the cosmos. This digital piece captures the wonders of space with vivid detail and imaginative flair.",
    year: "2023",
    medium: "Digital Art",
  },
];

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    title: "Amazing Art Collection",
    text: "Found incredible pieces for my home office. The quality and authenticity verification process is outstanding.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    title: "Exceptional Experience",
    text: "The curation is top-notch. Each piece comes with detailed provenance and artist information.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    rating: 4,
    title: "Great Platform",
    text: "Love the smooth buying process and the variety of digital art available. Would highly recommend!",
    date: "2 weeks ago",
  },
  {
    id: 4,
    name: "David Wilson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    title: "Impressive Collection",
    text: "The digital art pieces are stunning. Really appreciate the seamless checkout process.",
    date: "3 weeks ago",
  },
];

interface ImageLoadState {
  [key: number]: boolean;
}

const MotionImage = motion(Image);

interface PaintingCardProps {
  painting: Painting;
  index: number;
  isImageLoaded: boolean;
  onImageLoadComplete: (id: number) => void;
  onAddToCart: (painting: Painting) => void;
  onSelectPainting: (painting: Painting) => void;
}

function PaintingCard({
  painting,
  index,
  isImageLoaded,
  onImageLoadComplete,
  onAddToCart,
  onSelectPainting,
}: PaintingCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
      className={`group bg-[#0C0C0C] hover:bg-white/5 border border-white/10 
                   rounded-2xl overflow-hidden transition-all duration-300 shadow-xl`}
    >
      <div
        className="relative overflow-hidden aspect-square cursor-pointer"
        onClick={() => onSelectPainting(painting)}
      >
        <MotionImage
          priority={index < 4}
          onLoadingComplete={() => onImageLoadComplete(painting.id)}
          whileHover={{ scale: 1.05 }}
          src={painting.image}
          alt={painting.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            objectFit: "cover",
          }}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 sm:p-6 relative z-10">
        <h2
          className={`text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-[#14F195] transition-colors duration-300 truncate`}
        >
          {painting.name}
        </h2>
        <p className={`text-white/70 text-xs sm:text-sm mb-3 sm:mb-4`}>
          by {painting.artist}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <span className={`text-xl sm:text-2xl font-bold text-[#14F195]`}>
            ${painting.price}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`w-full sm:w-auto bg-[#14F195]/10 hover:bg-[#14F195]/20 text-[#14F195] font-semibold 
                         py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 cursor-pointer 
                         relative z-20 flex items-center justify-center gap-2 text-xs sm:text-sm`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(painting);
            }}
          >
            <FiShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  const [cart, setCart] = useState<Painting[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkout, setCheckout] = useState<boolean>(false);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [imagesLoaded, setImagesLoaded] = useState<ImageLoadState>({});
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const showcaseRef = useRef<HTMLElement | null>(null);

  const collectionData: Record<string, Painting[]> = {
    Abstract: paintings.filter(
      (p) =>
        p.medium === "Oil on Canvas" ||
        p.name.toLowerCase().includes("abstract")
    ),
    "Digital Art": paintings.filter((p) => p.medium === "Digital Art"),
    Watercolor: paintings.filter((p) => p.medium === "Watercolor"),
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const imageIds = paintings.map((p) => p.id);
    const initialImageLoadState: ImageLoadState = {};
    imageIds.forEach((id) => {
      initialImageLoadState[id] = false;
    });

    const imagePromises = paintings.map((painting) => {
      return new Promise<void>((resolve) => {
        const img = document.createElement("img");
        img.src = painting.image;
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, [painting.id]: true }));
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    });

    Promise.all(imagePromises).then(() => {
      // All preloading attempts finished
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const body = document.body;
    const isAnyModalOpen =
      isCartOpen ||
      isLearnMoreOpen ||
      !!selectedPainting ||
      !!selectedCollection;

    if (isAnyModalOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = "auto";
    };
  }, [isCartOpen, isLearnMoreOpen, selectedPainting, selectedCollection]);

  const filteredPaintings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return paintings;

    return paintings.filter(
      (painting) =>
        painting.name.toLowerCase().includes(query) ||
        painting.artist.toLowerCase().includes(query) ||
        painting.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalAmount = useMemo(
    () => cart.reduce((acc, painting) => acc + painting.price, 0),
    [cart]
  );

  const handleAddToCart = useCallback((painting: Painting) => {
    setCart((prevCart) => {
      const isAlreadyInCart = prevCart.some((item) => item.id === painting.id);

      if (isAlreadyInCart) {
        toast.error(`${painting.name} is already in your cart`, {
          id: `cart-${painting.id}`,
        });
        return prevCart;
      }

      toast.success(`${painting.name} added to cart`, {
        id: `cart-${painting.id}`,
      });
      return [...prevCart, painting];
    });
  }, []);

  const handleRemoveFromCart = useCallback((paintingId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== paintingId));
    toast.info(`Item removed from cart`);
  }, []);

  const handleSearch = useCallback((query: string): void => {
    setSearchQuery(query);
  }, []);

  const handleImageLoadComplete = (id: number): void => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const handleProcessPayment = async (): Promise<void> => {
    setIsProcessingPayment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Purchase complete! Thank you for your order.", {
        duration: 3000,
      });
      setCart([]);
      setCheckout(false);
      setIsCartOpen(false);
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubscribe = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubscribed(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thank you for subscribing!", {
      duration: 3000,
    });
    setEmail("");
    setIsSubscribed(false);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scrollToShowcase = (): void => {
    showcaseRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`${outfit.className} bg-[#0C0C0C] text-white overflow-x-hidden`}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#14F195] origin-left z-[100]"
        style={{ scaleX }}
      />
      <Toaster position="top-center" richColors />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] lg:w-[800px] sm:h-[500px] lg:h-[800px] bg-[#14F195]/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]`}
        />
        <div
          className={`absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[400px] lg:w-[600px] sm:h-[400px] lg:h-[600px] bg-[#FF3D00]/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px]`}
        />
      </div>

      <header
        className={`fixed w-full z-50 backdrop-blur-lg bg-[#0C0C0C]/80 border-b border-white/5`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div
              className={`text-xl sm:text-2xl font-bold ${syne.className} cursor-pointer text-white`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className={`text-[#14F195]`}>Art</span>
              <span>Vista</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group px-4 py-2 sm:px-6 sm:py-2 rounded-full border border-white/10 hover:border-[#14F195]/50 
                       transition-all duration-300 flex items-center gap-2 sm:gap-3 cursor-pointer`}
              onClick={() => setIsCartOpen(true)}
            >
              <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium text-white">
                Cart
              </span>
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#14F195]/10 flex items-center justify-center 
                             text-[#14F195] text-xs sm:text-sm`}
              >
                {cart.length}
              </span>
            </motion.button>
          </div>
        </nav>
      </header>

      <main>
        <section className="min-h-screen flex flex-col justify-center relative pt-24 sm:pt-32 pb-16 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="z-20 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white ${syne.className}`}
              >
                Discover the Future of
                <span className={`text-[#14F195]`}> Digital Art</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`mt-4 sm:mt-6 text-base sm:text-lg text-white max-w-md mx-auto lg:mx-0 lg:max-w-lg`}
              >
                Explore unique digital masterpieces from the world&apos;s most
                innovative artists. Own, collect, and trade the future of art.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={scrollToShowcase}
                  className={`px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-[#14F195] text-black rounded-full font-medium 
                                hover:bg-[#14F195]/90 transition-all duration-300 cursor-pointer`}
                >
                  Start Exploring
                </button>
                <button
                  onClick={() => setIsLearnMoreOpen(true)}
                  className={`px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base border border-white/10 text-white rounded-full font-medium 
                                hover:bg-white/5 transition-all duration-300 cursor-pointer`}
                >
                  Learn More
                </button>
              </motion.div>
            </div>
            <div className="relative z-10 mt-12 lg:mt-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-full aspect-[4/3]"
              >
                <Image
                  src={paintings[0].image}
                  alt="Featured Art"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
              <div
                className={`text-center mt-4 sm:text-left sm:absolute sm:mt-0 sm:-right-10 sm:-bottom-10 p-4 sm:p-6 bg-[#0C0C0C]/80 border border-white/5 rounded-2xl 
                            backdrop-blur-xl z-20`}
              >
                <p className={`text-xs sm:text-sm font-medium text-white/60`}>
                  Featured Art
                </p>
                <p
                  className={`text-lg sm:text-xl font-bold text-[#14F195] mt-1`}
                >
                  ${paintings[0].price}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0C0C0C] z-10`}
          />
        </section>

        <section ref={showcaseRef} className="py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 ${syne.className} text-center text-white`}
            >
              What Our <span className={`text-[#14F195]`}>Collectors</span> Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm`}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3
                        className={`font-medium text-white text-sm sm:text-base`}
                      >
                        {review.name}
                      </h3>
                      <p className={`text-xs sm:text-sm text-white/60`}>
                        {review.date}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 pt-1 sm:pt-0">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 text-[#14F195] fill-[#14F195]`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4
                    className={`text-base sm:text-lg font-medium text-[#14F195] mb-2`}
                  >
                    {review.title}
                  </h4>
                  <p className={`text-white/80 text-sm sm:text-base`}>
                    {review.text}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 sm:mt-12 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={`inline-flex flex-col sm:flex-row items-center gap-2 text-white/60 text-sm sm:text-base`}
              >
                <span className={`text-[#14F195] font-bold text-lg sm:text-xl`}>
                  4.9
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-[#14F195] fill-[#14F195]`}
                    />
                  ))}
                </div>
                <span className="ml-0 sm:ml-2">
                  from over 1,200+ happy collectors
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {checkout ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0A0A] rounded-2xl p-4 sm:p-8 text-white border border-white/10 shadow-xl max-w-3xl mx-auto"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Checkout
                </h2>
                {cart.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {cart.map((painting) => (
                        <div
                          key={painting.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white/5 border border-white/5 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden">
                              <Image
                                src={painting.image}
                                alt={painting.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-sm sm:text-base">
                                {painting.name}
                              </h3>
                              <p className="text-white/70 text-xs sm:text-sm">
                                by {painting.artist}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 sm:space-x-4 self-end sm:self-auto">
                            <span className="font-bold text-white text-sm sm:text-base">
                              ${painting.price}
                            </span>
                            <button
                              onClick={() => handleRemoveFromCart(painting.id)}
                              className="text-red-400 hover:text-red-500 transition-colors text-xs sm:text-sm cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-white/10 pt-6">
                      <div className="flex justify-between text-lg sm:text-xl font-bold text-white">
                        <span>Total:</span>
                        <span>${totalAmount}</span>
                      </div>
                      <button
                        className={`w-full mt-4 bg-[#14F195] hover:bg-[#14F195]/90 text-[#0C0C0C]
                                 font-bold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 
                                 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center shadow-lg text-sm sm:text-base gap-2`}
                        onClick={handleProcessPayment}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <div
                            className={`animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-[#0C0C0C]`}
                          />
                        ) : (
                          <>
                            <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            Checkout
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-white/70 text-center text-sm sm:text-base">
                    Your cart is empty
                  </p>
                )}
                <button
                  className={`mt-6 text-[#14F195] hover:text-[#14F195]/80 font-semibold text-sm sm:text-base cursor-pointer`}
                  onClick={() => setCheckout(false)}
                >
                  <FiArrowLeft className="inline-block mr-2" /> Back to Shop
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center mb-12 sm:mb-16"
                >
                  <h2
                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-center cursor-default ${syne.className}`}
                  >
                    Discover Digital Masterpieces
                  </h2>
                  <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-2xl">
                    <FiSearch
                      className={`absolute left-4 sm:left-6 top-1/2 z-10 transform -translate-y-1/2 text-[#999999] h-5 w-5 sm:h-6 sm:w-6`}
                    />
                    <input
                      type="search"
                      placeholder="Search by name, artist..."
                      className={`w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm 
                               text-white placeholder-white/50 focus:outline-none focus:ring-2 
                               focus:ring-[#14F195]/50 focus:border-[#14F195] transition-all duration-300 text-sm sm:text-base`}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {filteredPaintings.map((painting, index) => (
                    <PaintingCard
                      key={painting.id}
                      painting={painting}
                      index={index}
                      isImageLoaded={!!imagesLoaded[painting.id]}
                      onImageLoadComplete={handleImageLoadComplete}
                      onAddToCart={handleAddToCart}
                      onSelectPainting={setSelectedPainting}
                    />
                  ))}
                </div>
              </>
            )}
          </AnimatePresence>

          {selectedPainting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-[#0C0C0C]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4`}
              onClick={() => setSelectedPainting(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`bg-[#0C0C0C] border border-white/10 rounded-2xl overflow-hidden 
                           max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full shadow-2xl 
                           flex flex-col h-[80vh] md:h-[580px]`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6 flex-grow overflow-hidden">
                  <div className="relative w-full aspect-square md:aspect-auto md:h-full overflow-hidden">
                    <Image
                      src={selectedPainting.image}
                      alt={selectedPainting.name}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
                    <div>
                      <h2
                        className={`text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 ${syne.className}`}
                      >
                        {selectedPainting.name}
                      </h2>
                      <p
                        className={`text-base sm:text-lg md:text-xl text-[#14F195] mb-2 sm:mb-4`}
                      >
                        by {selectedPainting.artist}
                      </p>

                      <p
                        className={`text-white/80 text-sm sm:text-base leading-relaxed hidden md:block md:my-3 lg:my-4`}
                      >
                        {selectedPainting.description}
                      </p>

                      <div className="space-y-1 text-white/80 text-sm sm:text-base my-3 lg:my-4">
                        {selectedPainting.year && (
                          <p>
                            <strong className={`text-white/90`}>Year:</strong>{" "}
                            {selectedPainting.year}
                          </p>
                        )}
                        {selectedPainting.medium && (
                          <p>
                            <strong className={`text-white/90`}>Medium:</strong>{" "}
                            {selectedPainting.medium}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`mt-auto pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3`}
                    >
                      <span
                        className={`text-2xl sm:text-3xl font-bold text-white`}
                      >
                        ${selectedPainting.price}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`w-full sm:w-auto bg-[#14F195] hover:bg-[#14F195]/90 text-black font-semibold 
                                 py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all duration-300 cursor-pointer
                                 flex items-center justify-center gap-2 text-sm sm:text-base`}
                        onClick={() => {
                          handleAddToCart(selectedPainting);
                          setSelectedPainting(null);
                        }}
                      >
                        <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </section>

        <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className={`absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] lg:w-[600px] sm:h-[400px] lg:h-[600px] bg-[#14F195]/5 rounded-full blur-[80px] sm:blur-[100px]`}
            />
            <div
              className={`absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[300px] lg:w-[500px] sm:h-[300px] lg:h-[500px] bg-[#FF3D00]/5 rounded-full blur-[70px] sm:blur-[80px] lg:blur-[100px]`}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 ${syne.className} text-white text-center`}
            >
              Featured <span className={`text-[#14F195]`}>Collections</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {Object.keys(collectionData)
                .slice(0, 3)
                .map((collection, i) => (
                  <motion.div
                    key={collection}
                    whileHover={{ y: -5 }}
                    className={`relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer 
                           border border-white/10 group`}
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <Image
                      src={
                        collectionData[collection][0]?.image ||
                        paintings[(i * 2) % paintings.length].image
                      }
                      alt={collection}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/90 to-transparent  
                               opacity-80 group-hover:opacity-95 transition-opacity duration-300`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h3
                        className={`text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 ${syne.className}`}
                      >
                        {collection}
                      </h3>
                      <p
                        className={`text-sm sm:text-base text-[#14F195] transform translate-y-full opacity-0 
                               group-hover:translate-y-0 group-hover:opacity-100 
                               transition-all duration-300 ease-out`}
                      >
                        Explore Collection →
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
          <AnimatePresence>
            {selectedCollection && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 bg-[#0C0C0C]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4`}
                onClick={() => setSelectedCollection(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`bg-[#0C0C0C] w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-6xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]`}
                >
                  <div
                    className={`p-4 sm:p-6 border-b border-white/10 flex justify-between items-center`}
                  >
                    <h2
                      className={`text-lg sm:text-xl md:text-2xl font-bold text-white ${syne.className}`}
                    >
                      {selectedCollection} Collection
                    </h2>
                    <button
                      onClick={() => setSelectedCollection(null)}
                      className={`text-white/60 hover:text-white transition-colors cursor-pointer text-xl sm:text-2xl`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {collectionData[
                        selectedCollection as keyof typeof collectionData
                      ] &&
                      collectionData[
                        selectedCollection as keyof typeof collectionData
                      ].length > 0 ? (
                        collectionData[
                          selectedCollection as keyof typeof collectionData
                        ].map((painting) => (
                          <div
                            key={painting.id}
                            className={`bg-white/5 rounded-lg overflow-hidden group cursor-pointer border border-white/5`}
                            onClick={() => {
                              setSelectedPainting(painting);
                              setSelectedCollection(null);
                            }}
                          >
                            <div className="aspect-square relative overflow-hidden">
                              <Image
                                src={painting.image}
                                alt={painting.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-3 sm:p-4">
                              <h3
                                className={`font-medium text-white text-sm sm:text-base truncate`}
                              >
                                {painting.name}
                              </h3>
                              <p
                                className={`text-white/60 text-xs sm:text-sm truncate`}
                              >
                                by {painting.artist}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span
                                  className={`text-[#14F195] text-sm sm:text-base font-semibold`}
                                >
                                  ${painting.price}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(painting);
                                  }}
                                  className={`text-xs bg-[#14F195]/10 text-[#14F195] px-2 py-1 sm:px-3 rounded-full
                                           hover:bg-[#14F195]/20 transition-colors duration-300 cursor-pointer
                                           flex items-center gap-1`}
                                >
                                  <FiShoppingCart className="w-3 h-3" />
                                  <span className="hidden sm:inline">Add</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          className={`col-span-full text-center text-white/60 py-8 text-sm sm:text-base`}
                        >
                          No items in this collection yet.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="relative py-16 sm:py-24 lg:py-32 z-20">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className={`absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] lg:w-[700px] sm:h-[500px] lg:h-[700px] bg-[#14F195]/5 rounded-full blur-[100px] sm:blur-[120px] opacity-50`}
            />
            <div
              className={`absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] lg:w-[600px] sm:h-[400px] lg:h-[600px] bg-[#FF3D00]/5 rounded-full blur-[80px] sm:blur-[100px] opacity-50`}
            />
          </div>
          <div className="relative max-w-xs sm:max-w-md md:max-w-3xl mx-auto px-4 sm:px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6 sm:space-y-8 lg:space-y-10"
            >
              <h2
                className={`text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 ${syne.className}`}
              >
                Stay Updated
              </h2>
              <p
                className={`text-sm sm:text-base lg:text-lg text-white/70 mb-6 sm:mb-8 max-w-md sm:max-w-xl mx-auto`}
              >
                Subscribe to our newsletter for exclusive drops, artist
                features, and early access to new collections.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto relative"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`flex-1 px-4 sm:px-6 py-3 rounded-full bg-[#0C0C0C]/80 backdrop-blur-sm border border-white/10 
                           text-white placeholder-white/50 focus:outline-none focus:border-[#14F195]
                           focus:ring-2 focus:ring-[#14F195]/50 transition-all duration-300 relative z-10 text-sm sm:text-base`}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className={`px-4 sm:px-6 py-3 cursor-pointer rounded-full bg-[#14F195] text-black font-semibold 
                           hover:bg-[#14F195]/90 active:scale-95 transition-all duration-300
                           relative z-10 shadow-lg shadow-[#14F195]/20 text-sm sm:text-base disabled:opacity-70`}
                >
                  {isSubscribed ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        <footer className="relative z-20 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
          <div
            className={`relative border-t border-white/10 pt-8 sm:pt-12 lg:pt-16`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
                <div className="text-center sm:text-left">
                  <div
                    className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8 ${syne.className} cursor-pointer text-white`}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    <span className={`text-[#14F195]`}>Art</span>
                    <span>Vista</span>
                  </div>
                  <p className={`text-xs sm:text-sm text-white/60`}>
                    The future of digital art collection and trading.
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                    Quick Links
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    {["About Us", "Artists", "Collections", "Blog"].map(
                      (item) => (
                        <li
                          key={item}
                          className={`text-white/60 hover:text-[#14F195] transition-colors duration-300 cursor-pointer`}
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                    Support
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    {["FAQ", "Contact", "Terms", "Privacy"].map((item) => (
                      <li
                        key={item}
                        className={`text-white/60 hover:text-[#14F195] transition-colors duration-300 cursor-pointer`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                    Follow Us
                  </h4>
                  <div className="flex justify-center sm:justify-start space-x-4">
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="cursor-pointer"
                    >
                      <FiInstagram
                        className={`text-white/60 text-lg sm:text-xl hover:text-[#14F195] transition-colors duration-300`}
                      />
                    </a>
                    <a href="#" aria-label="Twitter" className="cursor-pointer">
                      <FiTwitter
                        className={`text-white/60 text-lg sm:text-xl hover:text-[#14F195] transition-colors duration-300`}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div
                className={`border-t border-white/10 mt-8 sm:mt-12 lg:mt-16 pt-4 sm:pt-6 lg:pt-8 text-center text-xs sm:text-sm lg:text-base text-white/60`}
              >
                © {new Date().getFullYear()} ArtVista. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-[#0C0C0C]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4`}
              onClick={() => setIsCartOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#0C0C0C] w-full max-w-xs sm:max-w-md md:max-w-lg rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]`}
              >
                <div className={`p-4 sm:p-6 border-b border-white/10`}>
                  <div className="flex justify-between items-center">
                    <h2
                      className={`text-lg sm:text-xl md:text-2xl font-bold text-white ${syne.className}`}
                    >
                      Your Cart
                    </h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className={`text-white/60 hover:text-white transition-colors cursor-pointer text-xl sm:text-2xl`}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
                  {cart.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {cart.map((painting) => (
                        <div
                          key={painting.id}
                          className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 bg-white/5 border border-white/5 p-3 sm:p-4 rounded-lg`}
                        >
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={painting.image}
                              alt={painting.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h3
                              className={`font-medium text-white text-sm sm:text-base`}
                            >
                              {painting.name}
                            </h3>
                            <p className={`text-white/60 text-xs sm:text-sm`}>
                              by {painting.artist}
                            </p>
                            <p
                              className={`text-[#14F195] mt-1 text-sm sm:text-base font-semibold`}
                            >
                              ${painting.price}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(painting.id)}
                            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer text-xs sm:text-sm mt-2 sm:mt-0 self-center sm:self-start flex-shrink-0 p-1 rounded hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-white/60 text-center py-8 text-sm sm:text-base`}
                    >
                      Your cart is empty. Explore our art!
                    </p>
                  )}
                </div>

                {cart.length > 0 && (
                  <div
                    className={`p-4 sm:p-6 border-t border-white/10 bg-white/5`}
                  >
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className={`text-white text-sm sm:text-base`}>
                        Total
                      </span>
                      <span
                        className={`text-white font-bold text-base sm:text-lg`}
                      >
                        ${totalAmount}
                      </span>
                    </div>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isProcessingPayment}
                      className={`w-full py-2 sm:py-3 px-4 bg-[#14F195] text-[#0C0C0C] rounded-lg font-medium
                               hover:bg-[#14F195]/90 transition-all duration-300 cursor-pointer text-sm sm:text-base
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div
                            className={`animate-spin rounded-full h-4 w-4 border-b-2 border-[#0C0C0C]`}
                          />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLearnMoreOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-[#0C0C0C]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4`}
              onClick={() => setIsLearnMoreOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#0C0C0C] w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]`}
              >
                <div className={`p-4 sm:p-6 border-b border-white/10`}>
                  <div className="flex justify-between items-center">
                    <h2
                      className={`text-lg sm:text-xl md:text-2xl font-bold text-white ${syne.className}`}
                    >
                      About ArtVista
                    </h2>
                    <button
                      onClick={() => setIsLearnMoreOpen(false)}
                      className={`text-white/60 hover:text-white transition-colors cursor-pointer text-xl sm:text-2xl`}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-grow overflow-y-auto text-sm sm:text-base">
                  <div className="space-y-3 sm:space-y-4">
                    <h3
                      className={`text-md sm:text-lg md:text-xl font-bold text-[#14F195]`}
                    >
                      Our Vision
                    </h3>
                    <p className={`text-white/80 leading-relaxed`}>
                      ArtVista is revolutionizing the digital art marketplace by
                      connecting artists and collectors in a seamless,
                      innovative platform. We believe in empowering artists
                      while making exceptional digital art accessible to
                      everyone. Our curated collection ensures quality and
                      authenticity.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-3 sm:py-4">
                    {[
                      {
                        title: "Artists",
                        value: "2.5K+",
                        desc: "Creative Pros",
                      },
                      {
                        title: "Artworks",
                        value: "15K+",
                        desc: "Unique Pieces",
                      },
                      {
                        title: "Collectors",
                        value: "10K+",
                        desc: "Active Buyers",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`bg-white/5 border border-white/5 p-3 sm:p-4 rounded-xl text-center sm:text-left`}
                      >
                        <p
                          className={`text-[#14F195] font-bold text-xl sm:text-2xl`}
                        >
                          {stat.value}
                        </p>
                        <p
                          className={`text-white font-medium text-sm sm:text-base`}
                        >
                          {stat.title}
                        </p>
                        <p className={`text-white/60 text-xs sm:text-sm`}>
                          {stat.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3
                      className={`text-md sm:text-lg md:text-xl font-bold text-[#14F195]`}
                    >
                      Why Choose Us?
                    </h3>
                    <ul className={`space-y-2 sm:space-y-3 text-white/80`}>
                      {[
                        "Curated high-quality digital artworks",
                        "Secure transactions & authenticity verification",
                        "Direct artist-collector relationships",
                        "Exclusive drops and limited editions",
                        "Support for emerging and established artists",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3">
                          <span
                            className={`text-[#14F195] mt-1 flex-shrink-0 text-lg`}
                          >
                            ›
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 sm:mt-8">
                    <button
                      onClick={() => {
                        setIsLearnMoreOpen(false);
                        scrollToShowcase();
                      }}
                      className={`w-full py-3 sm:py-4 bg-[#14F195] text-[#0C0C0C] rounded-xl font-medium cursor-pointer
                               hover:bg-[#14F195]/90 transition-all duration-300 text-sm sm:text-base`}
                    >
                      Start Exploring Art
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
