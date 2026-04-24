import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import RoleBasedActions from '../../components/product/RoleBasedActions';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, user } = useAppContext();
  const product = useMemo(() => products.find((p) => String(p.id) === id), [id, products]);

  if (!product) return <div className="text-center py-16">Product not found.</div>;

  const isOwner = product.seller?.name === user?.name;

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Product Images */}
      <div className="space-y-4">
        <img src={product.images?.[0]} alt={product.name} className="w-full rounded-xl h-[420px] object-cover" />
        {product.isUpcycled && product.images?.[1] && (
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <img src={product.images[0]} alt="Before" className="w-full rounded-lg h-32 object-cover" />
              <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Before</span>
            </div>
            <div className="relative">
              <img src={product.images[1]} alt="After" className="w-full rounded-lg h-32 object-cover" />
              <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">After</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Product Type Badge */}
        {product.isUpcycled && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-green-100 dark:from-purple-900/20 dark:to-green-900/20 border border-purple-200 dark:border-purple-800 rounded-full">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full"></span>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Upcycled Creation</span>
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">EGP {product.price}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400">{product.material} • {product.size} • {product.condition}</div>
        
        {/* Eco Credits Display */}
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
          <span className="text-green-600 dark:text-green-400">🌱</span>
          <span className="text-sm font-medium text-green-800 dark:text-green-300">
            {product.ecoCredits || 10} Eco Credits
          </span>
        </div>
        
        {/* Upcycled Story Section */}
        {product.isUpcycled && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg space-y-3">
            <h3 className="font-semibold text-purple-800 dark:text-purple-300">🎨 Creation Story</h3>
            {product.beforeDescription && (
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Original Item:</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">{product.beforeDescription}</p>
              </div>
            )}
            {product.afterDescription && (
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Transformation:</p>
                <p className="text-sm text-green-700 dark:text-green-300">{product.afterDescription}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Role-based actions */}
        <RoleBasedActions product={product} />
        
        {/* Owner indicator */}
        {isOwner && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">This is your listing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
