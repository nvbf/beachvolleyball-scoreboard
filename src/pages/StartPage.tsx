import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  Timer,
  SportsVolleyball,
  MusicNote,
  Timer as TimerOff,
  LiveTv,
  AdminPanelSettings,
  Lock,
  ChevronRight,
} from "@mui/icons-material";
import { colors } from "../theme";
import logo from "../osvb_logo_hi_res.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureItem {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  active: boolean;
}

const features: FeatureItem[] = [
  {
    title: "Demo Match",
    description: "Try the scoresheet without saving anything",
    path: "/demo",
    icon: <Timer sx={{ fontSize: 20 }} />,
    active: true,
  },
  {
    title: "See Tournaments",
    description: "Browse ongoing and past tournaments",
    path: "/tournaments",
    icon: <SportsVolleyball sx={{ fontSize: 20 }} />,
    active: true,
  },
  {
    title: "Create Tournament",
    description: "Connect matches to one tournament",
    path: "/create-tournament",
    icon: <MusicNote sx={{ fontSize: 20 }} />,
    active: true,
  },
  {
    title: "New Match",
    description: "Electronic scoresheet, no separate scorer needed",
    path: "/match",
    icon: <TimerOff sx={{ fontSize: 20 }} />,
    active: false,
  },
  {
    title: "Admin",
    description: "Manage your tournament",
    path: "/admin-tournament",
    icon: <AdminPanelSettings sx={{ fontSize: 20 }} />,
    active: false,
  },
  {
    title: "Access",
    description: "Get access to your tournament",
    path: "/claim-tournament",
    icon: <Lock sx={{ fontSize: 20 }} />,
    active: false,
  },
];

// ─── Row component ────────────────────────────────────────────────────────────

const FeatureRow: React.FC<{ item: FeatureItem; onClick: () => void }> = ({ item, onClick }) => (
  <Box
    onClick={item.active ? onClick : undefined}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      backgroundColor: item.active ? colors.cardBg : colors.metaBg,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "10px",
      padding: "16px 18px",
      cursor: item.active ? "pointer" : "default",
      opacity: item.active ? 1 : 0.55,
      transition: "background 0.12s",
      "&:hover": item.active ? { backgroundColor: colors.metaBg } : {},
    }}
  >
    {/* Status dot */}
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: item.active ? colors.ongoingBorder : colors.finishedBorder,
        flexShrink: 0,
      }}
    />

    {/* Text */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: 600,
          color: item.active ? colors.textPrimary : colors.textMuted,
          textDecoration: item.active ? "none" : "line-through",
          mb: "2px",
        }}
      >
        {item.title}
      </Typography>
      <Typography sx={{ fontSize: "12px", color: colors.textMuted }}>
        {item.description}
      </Typography>
    </Box>

    {/* Arrow or Soon badge */}
    {item.active ? (
      <ChevronRight sx={{ fontSize: "20px", color: colors.finishedBorder, flexShrink: 0 }} />
    ) : (
      <Box
        sx={{
          fontSize: "9px",
          fontWeight: 600,
          px: "7px",
          py: "2px",
          borderRadius: "10px",
          backgroundColor: colors.finishedStatusBg,
          color: colors.finishedStatusText,
          border: `1px solid ${colors.badgeBorder}`,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Soon
      </Box>
    )}
  </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

function StartPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: colors.pageBg, minHeight: "100vh" }}>

      {/* Hero */}
      <Box
        sx={{
          px: { xs: "24px", sm: "32px" },
          pt: { xs: "40px", sm: "52px" },
          pb: { xs: "32px", sm: "40px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "14px",
          borderBottom: `1px solid ${colors.borderLight}`,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="OSVB"
          sx={{ height: { xs: "80px", sm: "100px" }, width: "auto", objectFit: "contain" }}
        />
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.textFaint,
          }}
        >
          Live Score · OSVB
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "32px", sm: "40px" },
            fontWeight: 800,
            color: colors.textPrimary,
            lineHeight: 1.15,
          }}
        >
          Beach volleyball,<br />live.
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "15px" },
            color: colors.textMuted,
            lineHeight: 1.6,
            maxWidth: "340px",
          }}
        >
          Scoresheets, live scoring and tournament management — available for all.
        </Typography>
      </Box>

      {/* Feature list */}
      <Box sx={{ px: { xs: "16px", sm: "20px" }, py: { xs: "16px", sm: "20px" }, display: "flex", flexDirection: "column", gap: "8px" }}>
        {features.map((item) => (
          <FeatureRow
            key={item.title}
            item={item}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default StartPage;