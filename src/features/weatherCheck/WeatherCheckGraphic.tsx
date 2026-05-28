import weatherCheckDustBad from "../../../assets/weather_check_icons/optimized/weather-check-dust-bad.png";
import weatherCheckDustGood from "../../../assets/weather_check_icons/optimized/weather-check-dust-good.png";
import weatherCheckDustNormal from "../../../assets/weather_check_icons/optimized/weather-check-dust-normal.png";
import weatherCheckDustVeryBad from "../../../assets/weather_check_icons/optimized/weather-check-dust-very-bad.png";
import weatherCheckFeelsLikeCold from "../../../assets/weather_check_icons/optimized/weather-check-feels-like-cold.png";
import weatherCheckFeelsLikeComfort from "../../../assets/weather_check_icons/optimized/weather-check-feels-like-comfort.png";
import weatherCheckFeelsLikeCool from "../../../assets/weather_check_icons/optimized/weather-check-feels-like-cool.png";
import weatherCheckFeelsLikeHot from "../../../assets/weather_check_icons/optimized/weather-check-feels-like-hot.png";
import weatherCheckFeelsLikeWarm from "../../../assets/weather_check_icons/optimized/weather-check-feels-like-warm.png";
import weatherCheckHumidityComfort from "../../../assets/weather_check_icons/optimized/weather-check-humidity-comfort.png";
import weatherCheckHumidityDry from "../../../assets/weather_check_icons/optimized/weather-check-humidity-dry.png";
import weatherCheckHumidityHumid from "../../../assets/weather_check_icons/optimized/weather-check-humidity-humid.png";
import weatherCheckRainBad from "../../../assets/weather_check_icons/optimized/weather-check-rain-bad.png";
import weatherCheckRainCaution from "../../../assets/weather_check_icons/optimized/weather-check-rain-caution.png";
import weatherCheckRainLow from "../../../assets/weather_check_icons/optimized/weather-check-rain-low.png";
import weatherCheckRainNormal from "../../../assets/weather_check_icons/optimized/weather-check-rain-normal.png";
import weatherCheckUvCaution from "../../../assets/weather_check_icons/optimized/weather-check-uv-caution.png";
import weatherCheckUvLow from "../../../assets/weather_check_icons/optimized/weather-check-uv-low.png";
import weatherCheckUvNormal from "../../../assets/weather_check_icons/optimized/weather-check-uv-normal.png";
import weatherCheckWindBad from "../../../assets/weather_check_icons/optimized/weather-check-wind-bad.png";
import weatherCheckWindCaution from "../../../assets/weather_check_icons/optimized/weather-check-wind-caution.png";
import weatherCheckWindLow from "../../../assets/weather_check_icons/optimized/weather-check-wind-low.png";
import weatherCheckWindNormal from "../../../assets/weather_check_icons/optimized/weather-check-wind-normal.png";
import type { WeatherCheckIconKey } from "./weatherCheckUtils";

const weatherCheckGraphicByKey: Record<WeatherCheckIconKey, string> = {
  "rain-low": weatherCheckRainLow,
  "rain-normal": weatherCheckRainNormal,
  "rain-caution": weatherCheckRainCaution,
  "rain-bad": weatherCheckRainBad,
  "wind-low": weatherCheckWindLow,
  "wind-normal": weatherCheckWindNormal,
  "wind-caution": weatherCheckWindCaution,
  "wind-bad": weatherCheckWindBad,
  "dust-good": weatherCheckDustGood,
  "dust-normal": weatherCheckDustNormal,
  "dust-bad": weatherCheckDustBad,
  "dust-very-bad": weatherCheckDustVeryBad,
  "feels-like-cold": weatherCheckFeelsLikeCold,
  "feels-like-cool": weatherCheckFeelsLikeCool,
  "feels-like-comfort": weatherCheckFeelsLikeComfort,
  "feels-like-warm": weatherCheckFeelsLikeWarm,
  "feels-like-hot": weatherCheckFeelsLikeHot,
  "uv-low": weatherCheckUvLow,
  "uv-normal": weatherCheckUvNormal,
  "uv-caution": weatherCheckUvCaution,
  "humidity-dry": weatherCheckHumidityDry,
  "humidity-comfort": weatherCheckHumidityComfort,
  "humidity-humid": weatherCheckHumidityHumid,
};

export function WeatherCheckGraphic({
  iconKey,
  label,
}: {
  iconKey: WeatherCheckIconKey;
  label: string;
}) {
  return (
    <img
      src={weatherCheckGraphicByKey[iconKey]}
      alt=""
      aria-hidden="true"
      data-weather-check-icon={iconKey}
      title={label}
    />
  );
}
