import pandas as pd
from typing import List, Dict

def compute_laspeyres_index(scraped_records: List[Dict], route_weights: Dict[str, Dict]) -> float:
    if not scraped_records:
        return 100.0

    df = pd.DataFrame(scraped_records)
    
    # Booking horizon weights: T0 (20%), T7 (50%), T30 (30%)
    horizon_weights = {"T0": 0.20, "T7": 0.50, "T30": 0.30}
    df["h_weight"] = df["booking_horizon"].map(horizon_weights).fillna(0.33)
    df["weighted_fare"] = df["total_fare"] * df["h_weight"]

    route_pt = df.groupby("route_key")["weighted_fare"].sum()

    numerator = 0.0
    denominator = 0.0

    for route_key, pt_val in route_pt.items():
        if route_key in route_weights:
            wi = route_weights[route_key]["weight"]
            p0 = route_weights[route_key]["p0"]
            numerator += pt_val * wi
            denominator += p0 * wi

    if denominator == 0:
        return 100.0

    return round((numerator / denominator) * 100.0, 2)