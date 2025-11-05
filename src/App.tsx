import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Simple content just to see the navbar */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome to E-Store! 🛍️
            </h1>
            <p className="text-xl text-muted-foreground">
              Your awesome navbar is ready! Check out the navigation above 👆
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-2">📱 Electronics</h3>
                <p className="text-muted-foreground">Latest gadgets and devices</p>
              </div>
              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-2">👕 Fashion</h3>
                <p className="text-muted-foreground">Trendy clothing styles</p>
              </div>
              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-2">🏠 Home & Garden</h3>
                <p className="text-muted-foreground">Decor & furniture</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;