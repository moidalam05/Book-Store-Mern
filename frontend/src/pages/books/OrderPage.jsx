import { useGetAllOrdersByUserEmailQuery } from "../../app/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext.jsx";
import { getImageUrl } from "../../utils/getImageUrl";

const OrderPage = () => {
  const { currentUser } = useAuth();

  const { data, isLoading, isError } = useGetAllOrdersByUserEmailQuery(
    currentUser?.email
  );

  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Failed to load orders.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-5">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-3 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4">
                {order.productIds.map((product) => (
                  <div
                    key={product._id}
                    className="flex gap-4 items-start border rounded-md p-3"
                  >
                    <img
                      src={getImageUrl(product.coverImage)}
                      alt={product.title}
                      className="w-20 h-28 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        Category: {product.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${product.newPrice}</p>
                      <p className="text-sm text-gray-400 line-through">
                        ${product.oldPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address & Total */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <h4 className="font-semibold mb-1">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.country} - {order.address.zipcode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {order.phone}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    ${order.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
