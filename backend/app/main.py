import sys
import asyncio

# Windows par Playwright subprocess enable karne ke liye:
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.database import engine, Base
from app.services.scraper import run_full_scrape_cycle
from app.services.index_calculator import compute_laspeyres_index

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MoSPI Real-Time Airfare Index API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROUTE_METADATA = {
    "DEL-BOM": {"weight": 0.28, "p0": 4500.0},
    "BLR-DEL": {"weight": 0.22, "p0": 4800.0},
    "PAT-DEL": {"weight": 0.15, "p0": 4200.0}
}

@app.get("/api/v1/dashboard/stats")
async def get_dashboard_stats():
    return {
        "current_index": 118.42,
        "change_24h": 1.85,
        "routes_monitored": len(ROUTE_METADATA),
        "total_scraped_today": 4820,
        "active_anomalies": 2,
        "last_updated": datetime.utcnow().isoformat()
    }

@app.get("/api/v1/index/history")
async def get_index_history(range: str = "30d"):
    return [
        {"date": "2026-08-01", "index_value": 112.5},
        {"date": "2026-08-08", "index_value": 114.1},
        {"date": "2026-08-15", "index_value": 115.8},
        {"date": "2026-08-22", "index_value": 117.2},
        {"date": "2026-08-28", "index_value": 118.42}
    ]

@app.get("/api/v1/routes/trends")
async def get_route_trends(route: str = "DEL-BOM"):
    return [
        {"date": "2026-08-28", "t0_fare": 11500, "t7_fare": 6200, "t30_fare": 4100},
        {"date": "2026-08-27", "t0_fare": 10800, "t7_fare": 6100, "t30_fare": 4050},
        {"date": "2026-08-26", "t0_fare": 12200, "t7_fare": 6300, "t30_fare": 4150}
    ]

@app.get("/api/v1/alerts/surge")
async def get_surge_alerts():
    return [
        {
            "id": "alt_101",
            "route": "PAT-DEL",
            "airline": "IndiGo",
            "current_fare": 14200,
            "surge_percentage": 220,
            "severity": "CRITICAL",
            "detected_at": datetime.utcnow().isoformat()
        }
    ]

@app.post("/api/v1/scraper/trigger")
async def trigger_scraper():
    records = await run_full_scrape_cycle()
    new_index = compute_laspeyres_index(records, ROUTE_METADATA)
    return {
        "status": "success",
        "scraped_count": len(records),
        "computed_index": new_index
    }