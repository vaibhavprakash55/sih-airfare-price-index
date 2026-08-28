from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class AirfareLog(Base):
    __tablename__ = "airfare_logs"

    id = Column(Integer, primary_key=True, index=True)
    route_key = Column(String(10), index=True)
    airline = Column(String(50), nullable=False)
    booking_horizon = Column(String(5), nullable=False)  # T0, T7, T30
    base_fare = Column(Float, nullable=False)
    taxes = Column(Float, nullable=False)
    total_fare = Column(Float, nullable=False)
    travel_date = Column(DateTime, nullable=False)
    scraped_at = Column(DateTime, default=datetime.utcnow, index=True)

class DailyIndexRecord(Base):
    __tablename__ = "daily_index_records"

    id = Column(Integer, primary_key=True, index=True)
    index_value = Column(Float, nullable=False)
    base_period = Column(String(20), default="2024-Q1")
    total_quotes = Column(Integer, nullable=False)
    calculated_at = Column(DateTime, default=datetime.utcnow, index=True)

class SurgeAlert(Base):
    __tablename__ = "surge_alerts"

    id = Column(Integer, primary_key=True, index=True)
    route_key = Column(String(10), index=True)
    airline = Column(String(50), nullable=False)
    current_fare = Column(Float, nullable=False)
    baseline_fare = Column(Float, nullable=False)
    surge_percentage = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)  # MODERATE, HIGH, CRITICAL
    detected_at = Column(DateTime, default=datetime.utcnow)