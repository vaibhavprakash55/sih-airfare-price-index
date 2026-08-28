from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class AirfareLog(Base):
    __tablename__ = "airfare_logs"

    id = Column(Integer, primary_key=True, index=True)
    route_key = Column(String(10), index=True)
    airline = Column(String(50), nullable=False)
    booking_horizon = Column(String(5), nullable=False)
    base_fare = Column(Float, nullable=False)
    taxes = Column(Float, nullable=False)
    total_fare = Column(Float, nullable=False)
    travel_date = Column(DateTime, nullable=False)
    scraped_at = Column(DateTime, default=datetime.utcnow, index=True)