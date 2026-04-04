import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/NavBar";
import { signIn, signOut } from "next-auth/react";
import {
  InformationCircleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useAmbientMode } from "@/lib/hooks/useAmbientMode"; // Add this import
import { useWatchProvider } from "@/lib/context/watchPageProvider"; // Ensure this import is present

const Settings = () => {
  const { data: session } = useSession();
  const [customLists, setCustomLists] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [showTrailer, setShowTrailer] = useState(true);
  const [showSauce, setShowSauce] = useState(false); // Changed to false by default
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [anilistPaused, setAnilistPaused] = useState(false);
  const router = useRouter();
  const { ambientMode, toggleAmbientMode } = useAmbientMode(); // Add this line
  const { autoplay, setAutoPlay, autoNext, setAutoNext } = useWatchProvider();
  const [preferredQuality, setPreferredQuality] = useState("auto");
  const [dataSaver, setDataSaver] = useState(false); // New state for Data Saver
  const [defaultProvider, setDefaultProvider] = useState(""); // New state for Default Provider
  const [isDub, setIsDub] = useState(false); // New state for Sub/Dub option
  const [autoskip, setAutoskip] = useState("off"); // Changed to use state
  const [isHardSub, setIsHardSub] = useState(true); // New state for Hard/Soft Sub option
  const [navigationOption, setNavigationOption] = useState("sidebar"); // Initialize with 'sidebar'
  const [useOldNav, setUseOldNav] = useState(false); // New state for Old Mobile Nav setting

  useEffect(() => {
    // Fetch user settings when component mounts
    const fetchUserSettings = async () => {
      try {
        const response = await fetch(
          "/api/user/profile?name=" + session?.user?.name
        );
        const data = await response.json();
        setCustomLists(data.CustomLists);
        setSelectedTheme(data.Theme || "default");
        setShowTrailer(data.ShowTrailer !== false); // Default to true if not set
        setIsHardSub(data.IsHardSub !== undefined ? data.IsHardSub : true); // Load Hard/Soft Sub setting
        setNavigationOption(data.NavigationOption || "sidebar"); // Load navigation option
        setUseOldNav(data.UseOldNav !== undefined ? data.UseOldNav : false); // Load Old Mobile Nav setting
        setAutoskip(data.Autoskip || "off"); // Load autoskip setting
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    if (session) {
      fetchUserSettings();
    }

    // Load theme from cookie
    const cookieTheme = getCookie("selectedTheme");
    if (cookieTheme) {
      setSelectedTheme(cookieTheme);
      handleThemeChange(cookieTheme);
    }

    // Load showTrailer from localStorage
    const storedShowTrailer = localStorage.getItem("showTrailer");
    if (storedShowTrailer !== null) {
      setShowTrailer(storedShowTrailer === "true");
    }

    // Load useOldNav from localStorage
    const storedUseOldNav = localStorage.getItem("useOldNav");
    setUseOldNav(storedUseOldNav === "true");

    // Load showSauce from localStorage, default to false if not set
    const storedShowSauce = localStorage.getItem("showSauce");
    setShowSauce(storedShowSauce === "true");

    // Load incognito mode from localStorage
    const storedIncognitoMode = localStorage.getItem("incognitoMode");
    setIncognitoMode(storedIncognitoMode === "true");

    // Load AniList pause status
    const storedAnilistPaused = localStorage.getItem("anilistPaused");
    setAnilistPaused(storedAnilistPaused === "true");

    // Load preferred quality from localStorage
    const storedQuality = localStorage.getItem("preferredQuality");
    if (storedQuality) {
      setPreferredQuality(storedQuality);
    }

    // Load data saver from localStorage
    const storedDataSaver = localStorage.getItem("dataSaver");
    setDataSaver(storedDataSaver === "true");

    // Load default provider from localStorage
    const storedProvider = localStorage.getItem("providerId");
    if (storedProvider) {
      setDefaultProvider(storedProvider);
    }

    // Load sub/dub option from localStorage
    const storedIsDub = localStorage.getItem("isDub");
    setIsDub(storedIsDub === "true");

    // Load autoskip from localStorage
    const storedAutoskip = localStorage.getItem("autoskip");
    setAutoskip(storedAutoskip || "off"); // Default to 'off' if not set

    // If Data Saver is enabled, set relevant settings
    if (storedDataSaver === "true") {
      setShowTrailer(false);
      setPreferredQuality("480");
      setDataSaver(true);
      toggleAmbientMode(); // Turn off ambient mode
    }
  }, [session]);

  const handleDataSaverChange = async () => {
    const newDataSaverValue = !dataSaver;
    setDataSaver(newDataSaverValue);

    if (newDataSaverValue) {
      setShowTrailer(false);
      setPreferredQuality("480");
      toggleAmbientMode(); // Turn off ambient mode
    } else {
      // Reset to previous settings if Data Saver is turned off
      const storedShowTrailer = localStorage.getItem("showTrailer");
      const storedPreferredQuality = localStorage.getItem("preferredQuality");
      const storedAmbientMode = localStorage.getItem("ambientMode");

      setShowTrailer(storedShowTrailer === "true");
      setPreferredQuality(storedPreferredQuality || "auto");
      if (storedAmbientMode === "true") {
        toggleAmbientMode(); // Turn it back on if it was on
      }
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            DataSaver: newDataSaverValue,
            ShowTrailer: !newDataSaverValue ? showTrailer : false,
            PreferredQuality: "480",
            AmbientMode: false,
            IsHardSub: isHardSub // Save Hard/Soft Sub setting
          }
        })
      });
      const data = await res.json();
      if (data) {
        localStorage.setItem("dataSaver", newDataSaverValue.toString());
        toast.success(`Data Saver is now ${newDataSaverValue ? "on" : "off"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Data Saver setting");
      setDataSaver(!newDataSaverValue); // Revert the state if the API call fails
    }
  };

  const handleCustomListsChange = async () => {
    const newCustomListsValue = !customLists;
    setCustomLists(newCustomListsValue);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            CustomLists: newCustomListsValue
          }
        })
      });
      const data = await res.json();
      if (data) {
        toast.success(
          `Custom List is now ${newCustomListsValue ? "on" : "off"}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Custom List setting");
      setCustomLists(!newCustomListsValue); // Revert the state if the API call fails
    }
  };

  const handleDefaultProviderChange = async (provider: string) => {
    const previousProvider = defaultProvider;
    setDefaultProvider(provider);
    localStorage.setItem("providerId", provider);
    toast.success(
      `Default provider changed from ${previousProvider} to ${provider}`
    );
  };

  const handleIsDubChange = () => {
    const newIsDubValue = !isDub;
    const previousIsDub = isDub;
    setIsDub(newIsDubValue);
    localStorage.setItem("isDub", newIsDubValue.toString());
    toast.success(
      `Sub/Dub option changed from ${previousIsDub ? "Dub" : "Sub"} to ${newIsDubValue ? "Dub" : "Sub"}`
    );
  };

  const handleIsHardSubChange = () => {
    const newIsHardSubValue = !isHardSub;
    setIsHardSub(newIsHardSubValue);
    localStorage.setItem("isHardSub", newIsHardSubValue.toString());
    toast.success(
      `Sub option changed to ${newIsHardSubValue ? "Hard Sub (Gogoanime)" : "Soft Sub (Zoro)"}`
    );
  };

  const saveSettings = async () => {
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            DefaultProvider: defaultProvider,
            IsDub: isDub,
            IsHardSub: isHardSub, // Save Hard/Soft Sub setting
            NavigationOption: navigationOption, // Save Navigation Option
            UseOldNav: useOldNav // Save Old Mobile Nav setting
          }
        })
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const handleNavigationChange = (value: string) => {
    setNavigationOption(value);
    localStorage.setItem("navigationOption", value);
    toast.success(
      `Navigation set to ${value.charAt(0).toUpperCase() + value.slice(1)}`
    );
  };

  const handleThemeChange = (theme: string) => {
    const root = document.documentElement;

    // Remove all existing theme classes
    root.classList.remove(
      "theme-default",
      "theme-st",
      "theme-purple",
      "theme-ocean",
      "theme-forest",
      "theme-sunset",
      "theme-cyberpunk",
      "theme-dark",
      "theme-al",
      "theme-retro",
      "theme-aw",
      "theme-ka",
      "theme-anp"
    );

    // Add the new theme class, but only if it's not the default
    if (theme !== "default") {
      root.classList.add(`theme-${theme}`);
    }

    // Save the selected theme in a cookie
    document.cookie = `selectedTheme=${theme}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

    // Update state
    setSelectedTheme(theme);
    setThemeMenuOpen(false);
  };

  const handleClearLocalStorage = () => {
    localStorage.clear(); // Clear all stored data
    toast.success("Local storage cleared successfully");
  };

  const handleShowTrailerChange = async () => {
    const newShowTrailerValue = !showTrailer;
    setShowTrailer(newShowTrailerValue);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            ShowTrailer: newShowTrailerValue
          }
        })
      });
      const data = await res.json();
      if (data) {
        toast.success(
          `Trailer on homepage is now ${newShowTrailerValue ? "on" : "off"}`
        );
        localStorage.setItem("showTrailer", newShowTrailerValue.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Trailer setting");
      setShowTrailer(!newShowTrailerValue); // Revert the state if the API call fails
    }
  };

  const handleUseOldNavChange = async () => {
    const newUseOldNavValue = !useOldNav;
    setUseOldNav(newUseOldNavValue);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            UseOldNav: newUseOldNavValue
          }
        })
      });
      const data = await res.json();
      if (data) {
        toast.success(
          `Old Mobile Navigation is now ${newUseOldNavValue ? "enabled" : "disabled"}`
        );
        localStorage.setItem("useOldNav", newUseOldNavValue.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Old Mobile Navigation setting");
      setUseOldNav(!newUseOldNavValue); // Revert the state if the API call fails
    }
  };

  const handleShowSauceChange = async () => {
    const newShowSauceValue = !showSauce;
    setShowSauce(newShowSauceValue);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            ShowSauce: newShowSauceValue
          }
        })
      });
      const data = await res.json();
      if (data) {
        toast.success(
          `Sauce (18+) option is now ${newShowSauceValue ? "visible" : "hidden"}`
        );
        localStorage.setItem("showSauce", newShowSauceValue.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Sauce (18+) setting");
      setShowSauce(!newShowSauceValue); // Revert the state if the API call fails
    }
  };

  const handleIncognitoModeChange = async () => {
    const newIncognitoMode = !incognitoMode;
    setIncognitoMode(newIncognitoMode);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            IncognitoMode: newIncognitoMode,
            AnilistPaused: newIncognitoMode // Pause AniList when Incognito mode is on
          }
        })
      });
      const data = await res.json();
      if (data) {
        localStorage.setItem("incognitoMode", newIncognitoMode.toString());
        toast.success(
          `Incognito mode is now ${newIncognitoMode ? "on" : "off"}`
        );
        if (newIncognitoMode) {
          toast.info("AniList updates are paused while in Incognito mode");
        } else {
          toast.info("AniList updates are resumed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Incognito mode setting");
      setIncognitoMode(!newIncognitoMode); // Revert the state if the API call fails
    }
  };

  const handleAnilistPauseChange = async () => {
    const newAnilistPausedValue = !anilistPaused;
    setAnilistPaused(newAnilistPausedValue);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            AnilistPaused: newAnilistPausedValue
          }
        })
      });
      const data = await res.json();
      if (data) {
        toast.success(
          `AniList account is now ${newAnilistPausedValue ? "paused" : "active"}`
        );
        localStorage.setItem("anilistPaused", newAnilistPausedValue.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update AniList pause setting");
      setAnilistPaused(!newAnilistPausedValue); // Revert the state if the API call fails
    }
  };

  const handleAmbientModeChange = async () => {
    const newAmbientModeValue = !ambientMode;
    toggleAmbientMode();
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: session?.user?.name,
          settings: {
            AmbientMode: newAmbientModeValue
          }
        })
      });
      const data = await res.json();
      if (data) {
        toast.success(
          `Ambient mode is now ${newAmbientModeValue ? "on" : "off"}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Ambient mode setting");
      toggleAmbientMode(); // Revert the state if the API call fails
    }
  };

  const handleAutoplayChange = (value: string) => {
    localStorage.setItem("autoplay", value);
    toast.success(`AutoPlay is now ${value}`);
  };

  const handleAutoskipChange = (value: string) => {
    setAutoskip(value); // Update the state for autoskip
    localStorage.setItem("autoskip", value); // Save to localStorage
    toast.success(`Autoskip is now ${value}`);
  };

  const handleAutoNextChange = (value: string) => {
    setAutoNext(value);
    localStorage.setItem("autoNext", value);
    toast.success(`Autoplay Next is now ${value}`);
  };

  const handlePreferredQualityChange = (value: string) => {
    setPreferredQuality(value);
    localStorage.setItem("preferredQuality", value);
    toast.success(`Preferred quality set to ${value}`);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const res = await fetch("/api/user/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: session?.user?.name })
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Account deleted successfully.");
          signOut(); // Log out after deletion
        } else {
          toast.error("Failed to delete account.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error deleting account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary text-txt pt-16">
      {" "}
      {/* Added padding-top to move the component down */}
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <SettingSection title="User Preferences">
            <div className="hidden md:block">
              <SettingItem
                title="Sidebar, Dockbar, or OldNavBar"
                description="Choose between Dockbar, Sidebar, or OldNavBar for navigation."
              >
                <select
                  value={navigationOption}
                  onChange={(e) => handleNavigationChange(e.target.value)}
                  className="bg-secondary text-txt rounded p-2"
                >
                  <option value="sidebar">Sidebar</option>
                  <option value="dockbar">Dockbar</option>
                  <option value="oldnavbar">OldNavBar</option>
                </select>
              </SettingItem>
            </div>
            <div className="block md:hidden">
              <SettingItem
                title="Use Old Mobile Nav"
                description="Enable or disable the Old Mobile Navigation."
              >
                <Toggle checked={useOldNav} onChange={handleUseOldNavChange} />
              </SettingItem>
            </div>
            <SettingItem
              title="Data Saver"
              description="Enables data-saving features, turning off trailer playback, setting preferred quality to 480p, and disabling ambient mode."
            >
              <Toggle checked={dataSaver} onChange={handleDataSaverChange} />
            </SettingItem>
            <SettingItem
              title="Show Trailer on Homepage"
              description="Enable or disable trailer playback on the homepage"
            >
              <Toggle
                checked={showTrailer}
                onChange={handleShowTrailerChange}
              />
            </SettingItem>
            <SettingItem
              title="Enable Custom Lists"
              description="Disabling this will stop adding your Anime to 'Watched using 1Anime' list"
            >
              <Toggle
                checked={customLists}
                onChange={handleCustomListsChange}
              />
            </SettingItem>
            <SettingItem
              title="Show Sauce (18+) Option"
              description="Enable or disable the Sauce (18+) option, Show or don't show adult content"
            >
              <Toggle checked={showSauce} onChange={handleShowSauceChange} />
            </SettingItem>
            <SettingItem
              title="Incognito Mode"
              description="Browse without saving history or preferences. Pauses AniList updates when enabled."
            >
              <Toggle
                checked={incognitoMode}
                onChange={handleIncognitoModeChange}
              />
            </SettingItem>
            <SettingItem
              title="Pause AniList Account"
              description="Temporarily pause updates to your AniList account"
            >
              <Toggle
                checked={anilistPaused}
                onChange={handleAnilistPauseChange}
                disabled={dataSaver}
              />
            </SettingItem>
            <SettingItem
              title="Ambient Mode"
              description="Enable or disable ambient lighting effects during video playback"
            >
              <Toggle
                checked={ambientMode}
                onChange={handleAmbientModeChange}
                disabled={dataSaver}
              />
            </SettingItem>
            <SettingItem
              title="Light Mode"
              description="Toggle between light and dark mode"
            >
              <div className="text-gray-400 italic">Unavailable</div>
            </SettingItem>

            {/* Default Provider Selection */}
            <SettingItem
              title="Default Provider"
              description="Select your preferred default provider for watching."
            >
              <select
                value={defaultProvider}
                onChange={(e) => handleDefaultProviderChange(e.target.value)}
                className="bg-secondary text-txt rounded p-2"
                disabled={isHardSub} // Disable provider selection if Hard Sub is chosen
              >
                <option value="gogoanime">Gogoanime</option>
                <option value="zoro">Zoro</option>
                <option value="sudatchi">Sudatchi</option>
                <option value="animepahe">Animepahe</option>
                {/* Add more providers as needed */}
              </select>
            </SettingItem>

            {/* Hard/Soft Sub Toggle */}
            <SettingItem
              title="Sub Option"
              description="Choose between Hard Sub (Gogoanime) and Soft Sub (Zoro)."
            >
              <Toggle checked={isHardSub} onChange={handleIsHardSubChange} />
            </SettingItem>

            {/* Sub/Dub Toggle */}
            <SettingItem
              title="Sub/Dub Option"
              description="Choose between Sub and Dub for watching."
            >
              <Toggle checked={isDub} onChange={handleIsDubChange} />
            </SettingItem>
          </SettingSection>

          <SettingSection title="Video/Watch Settings">
            <SettingItem
              title="Autoplay Video"
              description={`Automatically play videos when loaded (Currently: ${autoplay === "on" ? "On" : "Off"})`}
            >
              <select
                value={autoplay || "off"}
                onChange={(e) => handleAutoplayChange(e.target.value)}
                className="bg-secondary text-txt rounded p-2"
                disabled={dataSaver}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </SettingItem>
            <SettingItem
              title="Autoskip intro/outro"
              description={`Automatically skip op/ed (Currently: ${autoskip === "on" ? "On" : "Off"})`}
            >
              <select
                value={autoplay || "off"}
                onChange={(e) => handleAutoskipChange(e.target.value)}
                className="bg-secondary text-txt rounded p-2"
                disabled={dataSaver}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </SettingItem>
            <SettingItem
              title="Autoplay Next"
              description={`Automatically play the next episode when the current one ends (Currently: ${autoNext === "on" ? "On" : "Off"})`}
            >
              <select
                value={autoNext || "off"}
                onChange={(e) => handleAutoNextChange(e.target.value)}
                className="bg-secondary text-txt rounded p-2"
                disabled={dataSaver}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </SettingItem>
            <SettingItem
              title="Preferred Video Quality"
              description="Set your preferred video quality (will be used when available)"
            >
              <select
                value={preferredQuality}
                onChange={(e) => handlePreferredQualityChange(e.target.value)}
                className="bg-secondary text-txt rounded p-2"
                disabled={dataSaver}
              >
                <option value="auto">Auto</option>
                <option value="1080">1080p</option>
                <option value="720">720p</option>
                <option value="480">480p</option>
                <option value="360">360p</option>
              </select>
            </SettingItem>
          </SettingSection>

          <SettingSection title="Appearance">
            <SettingItem title="Theme" description="Change the app's theme">
              <ThemeSelector
                selectedTheme={selectedTheme}
                themeMenuOpen={themeMenuOpen}
                setThemeMenuOpen={setThemeMenuOpen}
                handleThemeChange={handleThemeChange}
              />
            </SettingItem>
          </SettingSection>

          <SettingSection title="Privacy & Account">
            {session && (
              <>
                <SettingItem
                  title="Export your AniList to MyAnimeList"
                  description="Export your anime or manga list from AniList to a MAL compatible XML file or CSV."
                >
                  <button
                    className="bg-blue-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={() =>
                      router.push("https://fern.ignoffo.dev/export")
                    }
                  >
                    Export
                  </button>
                </SettingItem>
                <SettingItem
                  title="Log out"
                  description="Log out of your account"
                >
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={() => signOut()}
                  >
                    Log out
                  </button>
                </SettingItem>
                <SettingItem
                  title="Delete Account"
                  description="Permanently delete your account. This action cannot be undone."
                >
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </SettingItem>
              </>
            )}
            <SettingItem
              title="Clear Local Storage/Cache"
              description="Clears Watch History in your device. Doesn't log out your account"
            >
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={handleClearLocalStorage}
              >
                Clear
              </button>
            </SettingItem>
          </SettingSection>

          <SettingSection title="App Information">
            <div className="bg-secondary rounded-lg p-4 flex items-center space-x-4">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Official Domains: 1anime.app, 1anime.info, animeyee.lol (Proxy)
              </p>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
};

const SettingSection = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-secondary rounded-lg p-6 shadow-lg">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingItem = ({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex-grow">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
    <div className="ml-4 flex-shrink-0">{children}</div>
  </div>
);

const Toggle = ({
  checked,
  onChange,
  disabled
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${checked ? "bg-blue-600" : "bg-gray-600"}`}
      ></div>
      <div
        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${checked ? "transform translate-x-6" : ""}`}
      ></div>
    </div>
  </label>
);

const ThemeSelector = ({
  selectedTheme,
  themeMenuOpen,
  setThemeMenuOpen,
  handleThemeChange,
  disabled
}: {
  selectedTheme: string;
  themeMenuOpen: boolean;
  setThemeMenuOpen: (open: boolean) => void;
  handleThemeChange: (theme: string) => void;
  disabled?: boolean;
}) => (
  <div className="relative">
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
      onClick={() => setThemeMenuOpen(!themeMenuOpen)}
      disabled={disabled}
    >
      <span className="mr-2">{selectedTheme || "Select Theme"}</span>
      <ChevronDownIcon className="h-5 w-5" />
    </button>
    {themeMenuOpen && (
      <div className="absolute right-0 mt-2 py-2 w-56 bg-white rounded-md shadow-xl z-20">
        <ThemeOption
          title="Default Themes"
          theme="default"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="dark"
          label="Dark 2"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="al"
          label="AniList Dark"
          handleThemeChange={handleThemeChange}
        />
        <div className="border-t border-gray-100 my-1"></div>
        <ThemeOption
          title="Legacy Sites Themes"
          theme="aw"
          label="AniWave"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="ka"
          label="KissAnime"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="anp"
          label="AnimixPlay"
          handleThemeChange={handleThemeChange}
        />
        <div className="border-t border-gray-100 my-1"></div>
        <ThemeOption
          title="Special Themes"
          theme="st"
          label="☀️ Summer Times"
          handleThemeChange={handleThemeChange}
        />
        <div className="border-t border-gray-100 my-1"></div>
        <ThemeOption
          title="Regular Themes"
          theme="purple"
          label="Beerus Purple"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="ocean"
          label="Ocean Blue"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="forest"
          label="Forest Green"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="sunset"
          label="Sunset Orange"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="cyberpunk"
          label="Neon Cyberpunk"
          handleThemeChange={handleThemeChange}
        />
        <ThemeOption
          theme="retro"
          label="Retro Theme"
          handleThemeChange={handleThemeChange}
        />
      </div>
    )}
  </div>
);

const ThemeOption = ({
  title,
  theme,
  label,
  handleThemeChange
}: {
  title?: string;
  theme: string;
  label?: string;
  handleThemeChange: (theme: string) => void;
}) => (
  <>
    {title && (
      <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
        {title}
      </div>
    )}
    <button
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-300"
      onClick={() => handleThemeChange(theme)}
    >
      {label || theme}
    </button>
  </>
);

const getCookie = (name: string) => {
  const cookieValue = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? cookieValue.pop() : "";
};

export default Settings;
