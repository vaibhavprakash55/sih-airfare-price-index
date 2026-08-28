from typing import List, Dict

def detect_fare_anomalies(scraped_records: List[Dict], route_metadata: Dict[str, Dict]) -> List[Dict]:
    alerts = []
    
    for record in scraped_records:
        route = record.get("route_key")
        total_fare = record.get("total_fare", 0.0)
        
        if route in route_metadata:
            p0 = route_metadata[route]["p0"]
            surge_pct = round(((total_fare - p0) / p0) * 100, 2)
            
            # Agar price baseline se 80% ya usse zyada spike kare
            if surge_pct >= 80.0:
                severity = "CRITICAL" if surge_pct >= 150.0 else ("HIGH" if surge_pct >= 100.0 else "MODERATE")
                alerts.append({
                    "route_key": route,
                    "airline": record.get("airline", "IndiGo"),
                    "current_fare": total_fare,
                    "baseline_fare": p0,
                    "surge_percentage": surge_pct,
                    "severity": severity
                })
    return alerts