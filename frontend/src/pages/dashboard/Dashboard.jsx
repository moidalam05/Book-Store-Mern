import { useState, useEffect } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiActivity,
  FiMessageSquare,
  FiStar,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import {
  MdAdminPanelSettings,
  MdOutlineInventory,
  MdOutlineAttachMoney,
} from "react-icons/md";
import {
  AiOutlinePieChart,
  AiOutlineRise,
  AiOutlineTeam,
} from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  useGetDashboardChartsQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardQuickStatsQuery,
  useGetDashboardRecentDataQuery,
  useGetTopProductsQuery,
} from "../../app/features/dashboard/dashboardApi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
);

const Dashboard = () => {
  // Stats Data
  const { data: dashboardOverview } = useGetDashboardOverviewQuery(undefined, {
    pollingInterval: 5000,
  });
  const stats = dashboardOverview?.data;

  // Revenue Chart Data
  const { data: chartsData } = useGetDashboardChartsQuery(undefined, {
    pollingInterval: 5000,
  });
  // charts
  const revenueOrders = chartsData?.data?.revenueOrders || [];

  // quick stats
  const { data: quickStatsData } = useGetDashboardQuickStatsQuery(undefined, {
    pollingInterval: 5000,
  });

  const quickStat = quickStatsData?.data;

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const revenueByDay = {};
  const ordersByDay = {};

  revenueOrders.forEach((item) => {
    revenueByDay[item._id] = item.totalRevenue;
    ordersByDay[item._id] = item.totalOrders;
  });

  const revenueData = Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    return revenueByDay[day] || 0;
  });

  const ordersData = Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    return ordersByDay[day] || 0;
  });

  // Revenue Chart Data
  const revenueChartData = {
    labels: DAY_LABELS,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#8B5CF6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Orders",
        data: ordersData,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6B7280",
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  // user dirtibution
  const userDist = chartsData?.data?.userDistribution;

  const userDistributionValues = [
    userDist?.newUsers ?? 0,
    userDist?.activeUsers ?? 0,
    userDist?.inactiveUsers ?? 0,
    userDist?.premiumUsers ?? 0,
  ];
  // User Distribution Chart Data
  const userDistributionData = {
    labels: ["New Users", "Active Users", "Inactive Users", "Admin Users"],
    datasets: [
      {
        data: userDistributionValues,
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(139, 92, 246)",
          "rgb(16, 185, 129)",
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const userDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} users (${percentage}%)`;
          },
        },
      },
    },
  };

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyRevenue = chartsData?.data?.monthlyRevenue || [];

  const revenueByMonth = {};

  monthlyRevenue?.forEach((item) => {
    revenueByMonth[item._id] = item.revenue;
  });

  const monthlyRevenueValues = Array.from({ length: 6 }, (_, index) => {
    const monthNumber = index + 1;
    return revenueByMonth[monthNumber] || 0;
  });

  // Monthly Revenue Bar Chart Data
  const monthlyRevenueData = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenueValues,
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(139, 92, 246)",
          "rgb(139, 92, 246)",
          "rgb(139, 92, 246)",
          "rgb(139, 92, 246)",
          "rgb(139, 92, 246)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const monthlyRevenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6B7280",
          callback: function (value) {
            return "₹" + value / 1000 + "k";
          },
        },
      },
    },
  };

  // Top Products
  const { data: topProductsData } = useGetTopProductsQuery(undefined, {
    pollingInterval: 5000,
  });

  const topProducts = topProductsData?.data || [];

  // Quick Stats
  const quickStats = [
    {
      title: "Today's Revenue",
      value: `₹${quickStat?.todayRevenue?.toLocaleString("en-IN") ?? 0}`,
      change: `${quickStat?.trend >= 0 ? "+" : ""}${quickStat?.trend ?? 0}%`,
      icon: <FiDollarSign />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Weekly Revenue",
      value: `₹${quickStat?.weeklyRevenue?.toLocaleString("en-IN") ?? 0}`,
      change: "",
      icon: <FiActivity />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Avg Daily Sales",
      value: `₹${quickStat?.avgDailySales?.toLocaleString("en-IN") ?? 0}`,
      change: "",
      icon: <FiTrendingUp />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Active Sales Days",
      value: quickStat?.activeSalesDays ?? 0,
      change: "",
      icon: <BsClockHistory />,
      color: "from-amber-500 to-orange-600",
    },
  ];

  // Recent data
  const { data: recentData } = useGetDashboardRecentDataQuery(undefined, {
    pollingInterval: 5000,
  });
  // Recent Orders
  const recentOrders = recentData?.data?.recentOrders || [];

  // Recent Activities
  const recentActivities = recentData?.data?.recentActivities || [];

  const timeAgo = (date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";

      case "confirmed":
        return "bg-indigo-100 text-indigo-800";

      case "processing":
        return "bg-blue-100 text-blue-800";

      case "pending":
        return "bg-amber-100 text-amber-800";

      case "cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
                <MdAdminPanelSettings size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-gray-500 mt-1">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-linear-to-r from-blue-100 to-indigo-100">
                <AiOutlineTeam className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <AiOutlineRise size={14} />+{stats?.growthRate || 0}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalUsers}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Active: {stats?.activeUsers}
                </span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{
                      width: `${(stats?.activeUsers / stats?.totalUsers) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-linear-to-r from-green-100 to-emerald-100">
                <MdOutlineAttachMoney className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <AiOutlineRise size={14} />+{stats?.growthRate || 0}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ₹{stats?.totalRevenue}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Avg. Order: ₹{stats?.avgOrderValue}
                </span>
                <FiTrendingUp className="text-green-500" size={18} />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-linear-to-r from-purple-100 to-pink-100">
                <MdOutlineInventory className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <AiOutlineRise size={14} />+{stats?.growthRate || 0}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalOrders}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Conversion: {stats?.conversionRate}%
                </span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-purple-500 to-pink-600 rounded-full"
                    style={{ width: `${stats?.conversionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-linear-to-r from-amber-100 to-orange-100">
                <FiStar className="text-amber-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <AiOutlineRise size={14} />+{stats?.growthRate || 0}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.customerSatisfaction}/5.0
              </p>
              <div className="mt-4 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      star <= Math.floor(stats?.customerSatisfaction)
                        ? "bg-linear-to-r from-amber-100 to-orange-100 text-amber-600"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    <FiStar size={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Revenue Overview
                </h3>
                <p className="text-sm text-gray-500">Last 7 days performance</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Orders</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              <Line data={revenueChartData} options={revenueChartOptions} />
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  User Distribution
                </h3>
                <p className="text-sm text-gray-500">
                  User categories breakdown
                </p>
              </div>
              <div className="p-2 rounded-lg bg-linear-to-r from-purple-100 to-indigo-100">
                <AiOutlinePieChart className="text-purple-600" size={20} />
              </div>
            </div>
            <div className="h-72">
              <Doughnut
                data={userDistributionData}
                options={userDistributionOptions}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Quick Stats
                  </h3>
                  <p className="text-sm text-gray-500">
                    Real-time performance metrics
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiRefreshCw className="text-gray-600" size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`p-2 rounded-lg bg-linear-to-r ${stat.color} text-white`}
                      >
                        {stat.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stat.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Revenue Chart */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    Monthly Revenue
                  </h4>
                  <span className="text-sm text-gray-500">Last 6 months</span>
                </div>
                <div className="h-48">
                  <Bar
                    data={monthlyRevenueData}
                    options={monthlyRevenueOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Orders
                  </h3>
                  <p className="text-sm text-gray-500">Latest transactions</p>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {order.amount}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total this month:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{recentData?.data?.monthlySales?.totalRevenue || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Activities
                </h3>
                <p className="text-sm text-gray-500">Latest user actions</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities?.map((activity) => (
                <div
                  key={activity.time}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "order"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "user"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "upgrade"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {activity.type === "order" ? (
                      <FiShoppingCart size={16} />
                    ) : activity.type === "user" ? (
                      <FiUsers size={16} />
                    ) : activity.type === "upgrade" ? (
                      <FiTrendingUp size={16} />
                    ) : (
                      <FiMessageSquare size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {activity.user}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activity.action}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {timeAgo(activity.time)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Top Products
                </h3>
                <p className="text-sm text-gray-500">Best performing items</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">This month</span>
                <FiChevronRight className="text-gray-400" size={16} />
              </div>
            </div>
            <div className="space-y-4">
              {topProducts?.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <FiShoppingCart className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.sales.toLocaleString()} sales
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {product.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
