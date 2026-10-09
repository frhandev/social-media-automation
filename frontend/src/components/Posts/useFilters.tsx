"use client";

import { useState } from "react";

function useFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [date, setDate] = useState("");
  return {
    search,
    setSearch,
    status,
    setStatus,
    platform,
    setPlatform,
    date,
    setDate,
  };
}

export default useFilters;