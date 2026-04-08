import MobileNav from "@/components/shared/MobileNav";
import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSync,
  FaEnvelope
} from "react-icons/fa";
import axios from "axios"; // Import axios for making API calls

interface Server {
  url: string;
  altName: string;
}

interface ServerStatus {
  altName: string;
  status: string;
}

export default function Status() {
  const servers: Server[] = [
    { url: `${process.env.NEXT_PUBLIC_SORAKU_URL}/`, altName: "Soraku API" },
    { url: "https://soraku.vercel.app", altName: "Soraku Web" },
    { url: "https://apisoraku.vercel.app", altName: "API Server" }
  ];

  const [serverStatusList, setServerStatusList] = useState<ServerStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchServerStatusFromCache = async () => {
    try {
      const response = await axios.get("/api/cache/server-status"); // Fetch from Redis cache
      if (response.data) {
        setServerStatusList(response.data);
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error("Error fetching server status from cache:", error);
    }
  };

  const checkServerStatus = async () => {
    setIsChecking(true);

    const promises = servers.map(async ({ url, altName }) => {
      try {
        const response = await fetch(url);
        const status = response.ok ? "Up" : "Down";
        return { altName, status };
      } catch (error) {
        console.error(`Error checking server status for ${altName}:`, error);
        return { altName, status: "Error" };
      }
    });

    Promise.all(promises)
      .then((results) => {
        setServerStatusList(results);
        // Save results to Redis cache here
        axios.post("/api/cache/server-status", results); // Save to Redis cache
      })
      .catch((error) => {
        console.error("Error checking server statuses:", error);
      })
      .finally(() => {
        setIsChecking(false);
        setLastChecked(new Date());
      });
  };

  useEffect(() => {
    const rateLimitTimeout = 300000; // Set the rate limit to 5 minutes (300000 ms)

    const fetchData = async () => {
      await fetchServerStatusFromCache();
      if (!isChecking) {
        await checkServerStatus();
      }
    };

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch every 5 minutes
    }, rateLimitTimeout);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isChecking]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Up":
        return <FaCheck className="text-green-500" />;
      case "Down":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" />;
    }
  };

  const renderServerStatus = () => {
    return serverStatusList.map(({ altName, status }, index) => (
      <div
        key={index}
        className="stat-box p-4 bg-gray-800 rounded-lg shadow-md flex items-center"
      >
        <p className="text-lg font-bold text-white">{altName}</p>
        <p
          className={`text-2xl font-semibold ml-auto ${status === "Up" ? "text-green-500" : status === "Error" ? "text-yellow-500" : "text-red-500"}`}
        >
          {getStatusIcon(status)} {status || "Checking..."}
        </p>
      </div>
    ));
  };

  const handleRefresh = () => {
    checkServerStatus();
    axios.post("/api/cache/server-status", []); // Reset Redis cache on refresh
  };

  const handleContactSupport = () => {
    window.location.href = "https://1anime.app/docs/support"; // Replace with actual support email
  };

  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        transition={{ duration: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
      >
        <Head>
          <title>1Anime - Status</title>
          <meta name="Status" content="Status" />
        </Head>
        <>
          <Navbar withNav={true} scrollP={5} shrink={true} />
          <MobileNav hideProfile={true} />

          <motion.div
            className="w-full max-w-screen-lg p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-6">
              Server Status
            </h1>
            <div className="flex justify-between mb-4">
              <button
                onClick={handleRefresh}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
              <button
                onClick={handleContactSupport}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                <FaEnvelope className="mr-2" /> Contact Support
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderServerStatus()}
            </div>
          </motion.div>
        </>
      </motion.div>
      <Footer />
    </>
  );
}
