
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart, 
  LogOut, 
  Package, 
  Settings,
  ChevronDown,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Shirt,
  ShoppingBag,
  Home as HomeIcon,
  Dumbbell,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
// import { useCart } from '@/hooks/useCart';

interface NavbarProps {
  className?: string;
}

// Navigation Categories with Subcategories
const navigationCategories = [
  {
    title: 'Electronics',
    href: '/category/electronics',
    description: 'Latest tech gadgets and devices',
    items: [
      {
        title: 'Smartphones',
        href: '/category/electronics/smartphones',
        description: 'Latest phones from top brands',
        icon: Smartphone,
      },
      {
        title: 'Laptops',
        href: '/category/electronics/laptops',
        description: 'Powerful computing devices',
        icon: Laptop,
      },
      {
        title: 'Smartwatches',
        href: '/category/electronics/smartwatches',
        description: 'Wearable technology',
        icon: Watch,
      },
      {
        title: 'Headphones',
        href: '/category/electronics/headphones',
        description: 'Audio devices and accessories',
        icon: Headphones,
      },
      {
        title: 'Cameras',
        href: '/category/electronics/cameras',
        description: 'Photography equipment',
        icon: Camera,
      },
    ],
  },
  {
    title: 'Fashion',
    href: '/category/fashion',
    description: 'Trendy clothing and accessories',
    items: [
      {
        title: "Men's Clothing",
        href: '/category/fashion/mens',
        description: 'Stylish apparel for men',
        icon: Shirt,
      },
      {
        title: "Women's Clothing",
        href: '/category/fashion/womens',
        description: 'Fashion for women',
        icon: ShoppingBag,
      },
      {
        title: 'Accessories',
        href: '/category/fashion/accessories',
        description: 'Bags, watches, and more',
        icon: Watch,
      },
    ],
  },
  {
    title: 'Home & Garden',
    href: '/category/home-garden',
    description: 'Everything for your home',
    items: [
      {
        title: 'Furniture',
        href: '/category/home-garden/furniture',
        description: 'Quality home furniture',
        icon: HomeIcon,
      },
      {
        title: 'Decor',
        href: '/category/home-garden/decor',
        description: 'Home decoration items',
        icon: HomeIcon,
      },
    ],
  },
];

const quickLinks = [
  { name: 'Sports', href: '/category/sports', icon: Dumbbell },
  { name: 'Books', href: '/category/books', icon: BookOpen },
  { name: 'Toys & Games', href: '/category/toys', icon: Gamepad2 },
];

export const Navbar = ({ className }: NavbarProps) => {
  const navigate = useNavigate();
//   const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock auth state - replace with your actual auth hook
  const isAuthenticated = true; // Change to false to see login button
  const user = {
    name: 'Saransh Basu',
    email: 'saransh@example.com',
    avatar: 'https://github.com/shadcn.png',
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        isScrolled && 'shadow-md',
        className
      )}
    >
      {/* Top Announcement Bar */}
      <div className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-center text-sm font-medium">
            🎉 Free shipping on orders over $100 | Use code: FREESHIP
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              ES
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              E-Store
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationCategories.map((category) => (
                  <NavigationMenuItem key={category.title}>
                    <NavigationMenuTrigger className="h-10">
                      {category.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {category.items.map((item) => (
                          <ListItem
                            key={item.title}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                          >
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                {quickLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link to={link.href}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button - Desktop */}
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] lg:w-[300px] pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Search Button - Mobile */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Search Products</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSearch} className="mt-4">
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </form>
              </SheetContent>
            </Sheet>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    {cart.itemCount}
                  </Badge>
                )}

              </Link>
            </Button> */}

            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hidden sm:flex">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="hidden sm:flex">
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {/* User Info */}
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                  )}

                  {/* Categories */}
                  <div className="flex flex-col gap-4">
                    {navigationCategories.map((category) => (
                      <div key={category.title} className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                          {category.title}
                        </h3>
                        <div className="flex flex-col gap-1 ml-2">
                          {category.items.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Separator />

                    {/* Quick Links */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                        Quick Links
                      </h3>
                      <div className="flex flex-col gap-1 ml-2">
                        {quickLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <link.icon className="h-4 w-4" />
                            <span>{link.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* User Actions */}
                  {isAuthenticated && (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <Separator />
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Custom List Item Component for Navigation Menu
const ListItem = ({ 
  className, 
  title, 
  children, 
  href, 
  icon: Icon,
  ...props 
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
  icon?: React.ElementType;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default Navbar;
