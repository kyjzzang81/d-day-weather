type NominatimAddress = {
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  town?: string;
  village?: string;
  city_district?: string;
  county?: string;
  city?: string;
};

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: "json",
    "accept-language": "ko",
    addressdetails: "1",
    zoom: "16"
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      "User-Agent": "ggg-mvp/1.0"
    }
  });

  if (!response.ok) return null;

  const body = (await response.json()) as { address?: NominatimAddress; display_name?: string };
  return formatKoreanDisplayLocation(body.address, body.display_name);
}

function formatKoreanDisplayLocation(address?: NominatimAddress, displayName?: string): string | null {
  if (!address) {
    return pickFromDisplayName(displayName);
  }

  const town = address.town ?? address.county;
  const village = address.village;

  if (village && town && (town.endsWith("면") || town.endsWith("읍"))) {
    return `${town} ${village}`;
  }

  if (village?.endsWith("리") && town) {
    return `${town} ${village}`;
  }

  const dongCandidate = [address.suburb, address.neighbourhood, address.quarter].find(Boolean);
  if (dongCandidate) {
    return dongCandidate;
  }

  if (address.city_district) {
    return address.city_district;
  }

  if (address.city) {
    if (town && (town.endsWith("읍") || town.endsWith("면"))) {
      return `${address.city} ${town}`;
    }
    return address.city;
  }

  if (town) return town;

  return pickFromDisplayName(displayName);
}

function pickFromDisplayName(displayName?: string): string | null {
  if (!displayName) return null;

  const parts = displayName.split(",").map((part) => part.trim());
  const localPart = parts.find(
    (part) => part.endsWith("동") || part.endsWith("리") || part.endsWith("읍") || part.endsWith("면")
  );

  return localPart ?? parts[0] ?? null;
}
