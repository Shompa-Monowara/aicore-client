app.get("/api/creator/analytics", verifyToken, verifyRole(["creator", "admin"]), async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const creatorPrompts = await promptCollection.find({
      $or: [{ email: email }, { creatorEmail: email }]
    }).toArray();
    const totalPrompts = creatorPrompts.length;

    let totalCopies = 0;
    const promptIdsStr = creatorPrompts.map(p => p._id.toString());

    creatorPrompts.forEach((p) => {
      totalCopies += (p.copyCount || 0);
    });

    const bookmarkMap = {};
    let totalBookmarks = 0;

    if (promptIdsStr.length > 0) {
      const bookmarkCounts = await bookmarkCollection.aggregate([
        { $match: { promptId: { $in: promptIdsStr } } },
        { $group: { _id: "$promptId", count: { $sum: 1 } } }
      ]).toArray();

      bookmarkCounts.forEach(b => {
        if (b._id) {
          bookmarkMap[b._id.toString()] = b.count;
          totalBookmarks += b.count;
        }
      });
    }

    const barData = creatorPrompts.map((p) => {
      const idStr = p._id.toString();
      return {
        name: p.title.length > 12 ? p.title.substring(0, 12) + "..." : p.title,
        Bookmarks: bookmarkMap[idStr] || 0,
        Copies: p.copyCount || 0
      };
    });

    // ============================================
    //  REAL GROWTH LINE (cumulative, day-by-day)
    // ============================================
    const promptDayCounts = {};
    creatorPrompts.forEach((p) => {
      const day = new Date(p.createdAt).toISOString().split("T")[0];
      promptDayCounts[day] = (promptDayCounts[day] || 0) + 1;
    });

    const copyDayCounts = {};
    if (promptIdsStr.length > 0) {
      const copyLogs = await copyLogCollection
        .find({ promptId: { $in: promptIdsStr } })
        .toArray();
      copyLogs.forEach((c) => {
        const day = new Date(c.createdAt).toISOString().split("T")[0];
        copyDayCounts[day] = (copyDayCounts[day] || 0) + 1;
      });
    }

    const allDays = Array.from(
      new Set([...Object.keys(promptDayCounts), ...Object.keys(copyDayCounts)])
    ).sort();

    let runningPrompts = 0;
    let runningCopies = 0;
    let lineData = allDays.map((day) => {
      runningPrompts += promptDayCounts[day] || 0;
      runningCopies += copyDayCounts[day] || 0;
      return {
        name: day,
        "Total Copies": runningCopies,
        "Total Prompts": runningPrompts,
      };
    });

    if (lineData.length === 0 && totalPrompts > 0) {
      const todayStr = new Date().toISOString().split("T")[0];
      lineData = [{ name: todayStr, "Total Copies": totalCopies, "Total Prompts": totalPrompts }];
    }

    res.json({
      stats: { totalPrompts, totalCopies, totalBookmarks },
      barData,
      lineData
    });
  } catch (error) {
    console.error("Creator analytics error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});