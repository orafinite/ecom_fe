import {
  useId,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { SearchIcon, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CartSidebar from "../cart/cart-sidebar";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "#", label: "Shop" },
  { href: "products", label: "Products" },
];

export default function Navbar() {
  const id = useId();

  // Vanishing input states and refs
  const placeholders = useMemo(
    () => [
    "Mechanical keyboards",
  "Wireless gaming mice",
  "4K Ultra HD monitors",
  "Smartphones and accessories",
  "Gaming headsets",
  "Ergonomic mouse pads",
  "RGB PC cases",
  "Laptop cooling pads",
  "USB-C hubs and adapters",
  "Mechanical key switches",
  "Bluetooth speakers",
  "Noise-cancelling headphones",
  "Wireless chargers",
  "Portable SSD drives",
  "Graphics cards",
  "Smartwatches and fitness bands",
  "Gaming chairs",
  "VR headsets",
  "Mechanical keyboard keycaps",
  "Monitor arms and stands"
    ],
    []
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const [animating, setAnimating] = useState<boolean>(false);

  useEffect(() => {
    const startAnimation = () => {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 2000);
      return () => clearInterval(interval);
    };

    startAnimation();
  }, [placeholders.length]);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);

      // Add your search logic here
      console.log("Searching for:", value);
    }
  };

  return (
    <>
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Main nav */}
          <div className="flex flex-1 items-center gap-6 max-md:justify-between">
            <a href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search form with vanishing effect */}
          <div className="relative max-md:hidden w-80">
            <canvas
              className={cn(
                "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 origin-top-left filter invert dark:invert-0 z-20",
                !animating ? "opacity-0" : "opacity-100"
              )}
              ref={canvasRef}
            />
            <Input
              id={id}
              ref={inputRef}
              className={cn(
                "peer h-8 ps-8 pe-2 relative z-10 w-full",
                animating && "text-transparent dark:text-transparent"
              )}
              placeholder=""
              type="search"
              value={value}
              onChange={(e) => {
                if (!animating) {
                  setValue(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 peer-disabled:opacity-50 z-20">
              <SearchIcon size={16} />
            </div>
            <div className="absolute inset-0 flex items-center pointer-events-none ps-8 z-0">
              <AnimatePresence mode="wait">
                {!value && (
                  <motion.p
                    initial={{
                      y: 5,
                      opacity: 0,
                    }}
                    key={`current-placeholder-${currentPlaceholder}`}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: -15,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "linear",
                    }}
                    className="dark:text-zinc-500 text-xs font-normal text-neutral-500 text-left w-[calc(100%-2rem)] truncate"
                  >
                    {placeholders[currentPlaceholder]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Button
            asChild
            size="icon"
            className="text-sm relative max-md:hidden"
            onClick={() => setIsCartOpen(true)}
          >
            <a href="#">
              <span className="flex items-baseline gap-2">
                <ShoppingCart />
                <span className="text-[9px] absolute top-0 right-0 bg-red-700 rounded-full size-3 items-center justify-center flex ">
                  1
                </span>
              </span>
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-sm max-md:hidden"
          >
            <a href="/login">Sign In</a>
          </Button>

          {/* Mobile menu trigger - NOW ON RIGHT */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem
                    className="w-full"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <div
                      role="separator"
                      aria-orientation="horizontal"
                      className="-mx-1 my-1 h-px bg-border"
                    ></div>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink href="#" className="py-1.5">
                      Sign In
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Button
                      asChild
                      size="sm"
                      className="mt-0.5 w-full text-left text-sm"
                      onClick={() => setIsCartOpen(true)}
                    >
                      <span className="flex items-baseline gap-2">
                        Cart
                        <span className="text-xs text-primary-foreground/60">
                          2
                        </span>
                      </span>
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
    <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
