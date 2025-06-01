import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 1,
          orderNumber: "ORD-2024-001",
          customerName: "John Doe",
          customerEmail: "john.doe@example.com",
          status: "DELIVERED",
          totalAmount: 1139750,
          orderDate: "2024-12-15",
          deliveryDate: "2024-12-18",
          items: [
            { title: "The Great Gatsby", quantity: 1, price: 395750 },
            { title: "To Kill a Mockingbird", quantity: 2, price: 372000 },
          ],
          shippingAddress: "123 Main St, New York, NY 10001",
        },
        {
          id: 2,
          orderNumber: "ORD-2024-002",
          customerName: "Jane Smith",
          customerEmail: "jane.smith@example.com",
          status: "PROCESSING",
          totalAmount: 742750,
          orderDate: "2024-12-18",
          deliveryDate: null,
          items: [
            { title: "1984", quantity: 1, price: 370750 },
            { title: "Animal Farm", quantity: 1, price: 372000 },
          ],
          shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
        },
        {
          id: 3,
          orderNumber: "ORD-2024-003",
          customerName: "Mike Johnson",
          customerEmail: "mike.johnson@example.com",
          status: "SHIPPED",
          totalAmount: 1683250,
          orderDate: "2024-12-19",
          deliveryDate: "2024-12-22",
          items: [
            { title: "The Catcher in the Rye", quantity: 1, price: 420750 },
            { title: "Lord of the Flies", quantity: 2, price: 321750 },
            { title: "Pride and Prejudice", quantity: 1, price: 618750 },
          ],
          shippingAddress: "789 Pine St, Chicago, IL 60601",
        },
        {
          id: 4,
          orderNumber: "ORD-2024-004",
          customerName: "Emily Davis",
          customerEmail: "emily.davis@example.com",
          status: "PENDING",
          totalAmount: 495750,
          orderDate: "2024-12-20",
          deliveryDate: null,
          items: [
            {
              title: "Harry Potter and the Sorcerer's Stone",
              quantity: 1,
              price: 495750,
            },
          ],
          shippingAddress: "321 Elm St, Boston, MA 02101",
        },
        {
          id: 5,
          orderNumber: "ORD-2024-005",
          customerName: "Robert Wilson",
          customerEmail: "robert.wilson@example.com",
          status: "CANCELLED",
          totalAmount: 891500,
          orderDate: "2024-12-17",
          deliveryDate: null,
          items: [{ title: "The Hobbit", quantity: 2, price: 445750 }],
          shippingAddress: "654 Maple Dr, Seattle, WA 98101",
        },
        {
          id: 6,
          orderNumber: "ORD-2024-006",
          customerName: "Sarah Brown",
          customerEmail: "sarah.brown@example.com",
          status: "DELIVERED",
          totalAmount: 1299250,
          orderDate: "2024-12-10",
          deliveryDate: "2024-12-14",
          items: [
            { title: "Dune", quantity: 1, price: 569750 },
            { title: "The Martian", quantity: 1, price: 420750 },
            { title: "Ender's Game", quantity: 1, price: 309750 },
          ],
          shippingAddress: "987 Cedar Ln, Austin, TX 78701",
        },
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "SHIPPED":
        return <Truck size={16} className="text-blue-600" />;
      case "PROCESSING":
        return <Clock size={16} className="text-amber-600" />;
      case "PENDING":
        return <Clock size={16} className="text-orange-600" />;
      case "CANCELLED":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    let statusClasses = "";

    switch (status) {
      case "DELIVERED":
        statusClasses = "bg-green-100 text-green-800 border border-green-200";
        break;
      case "SHIPPED":
        statusClasses = "bg-blue-100 text-blue-800 border border-blue-200";
        break;
      case "PROCESSING":
        statusClasses = "bg-amber-100 text-amber-800 border border-amber-200";
        break;
      case "PENDING":
        statusClasses =
          "bg-orange-100 text-orange-800 border border-orange-200";
        break;
      case "CANCELLED":
        statusClasses = "bg-red-100 text-red-800 border border-red-200";
        break;
      default:
        statusClasses = "bg-gray-100 text-gray-800 border border-gray-200";
    }

    return (
      <span className={`${baseClasses} ${statusClasses}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package className="text-amber-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-stone-800">
              Order Management
            </h1>
          </div>
          <p className="text-stone-600">
            Manage customer orders, track shipments, and handle order status
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Search by order number, customer name or email..."
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
              />
              <select
                className="pl-10 pr-8 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Order
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Order Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-stone-100 hover:bg-stone-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-amber-800 font-medium mr-3">
                            <Package size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-stone-800">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-stone-500 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {order.orderDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-stone-800">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-stone-500">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-stone-800 font-medium">
                          <DollarSign size={14} className="mr-1" />
                          {formatCurrency(order.totalAmount)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-stone-600">
                        {order.orderDate}
                        {order.deliveryDate && (
                          <div className="text-xs text-green-600">
                            Delivered: {order.deliveryDate}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="font-medium text-stone-800">
                            {order.items.length} item
                            {order.items.length > 1 ? "s" : ""}
                          </div>
                          <div className="text-stone-500 truncate max-w-32">
                            {order.items[0].title}
                            {order.items.length > 1 &&
                              ` +${order.items.length - 1} more`}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-stone-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
              <div className="text-sm text-stone-500">
                Showing {indexOfFirstOrder + 1} to{" "}
                {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-stone-300 rounded text-sm hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === page
                          ? "bg-amber-600 text-white border-amber-600"
                          : "border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-stone-300 rounded text-sm hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-stone-800">
                  {orders.length}
                </p>
              </div>
              <Package className="text-amber-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter((order) => order.status === "PENDING").length}
                </p>
              </div>
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600">
                  Delivered Orders
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    orders.filter((order) => order.status === "DELIVERED")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-stone-800">
                  {formatCurrency(
                    orders.reduce(
                      (sum, order) =>
                        order.status !== "CANCELLED"
                          ? sum + order.totalAmount
                          : sum,
                      0
                    )
                  )}
                </p>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
