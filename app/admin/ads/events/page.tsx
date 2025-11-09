'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Plus, Edit, Trash2, Calendar, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  description: string;
  type: string;
  multiplier: number;
  active: boolean;
  startsAt: string;
  expiresAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    multiplier: 2,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/admin/ads/events');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    try {
      const response = await fetch('/api/admin/ads/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'MULTIPLIER_EVENT',
          active: true
        })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          multiplier: 2,
          startDate: '',
          endDate: ''
        });
        loadEvents();
        alert('✅ Event created successfully!');
      } else {
        const data = await response.json();
        alert(`❌ Error: ${data.error || 'Failed to create event'}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('❌ Error creating event');
    }
  };

  const toggleEvent = async (eventId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/ads/events/${eventId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      });

      if (response.ok) {
        loadEvents();
      }
    } catch (error) {
      console.error('Error toggling event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/ads/events/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadEvents();
        alert('✅ Event deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('❌ Error deleting event');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-600" />
            ⚡ Special Events Manager
          </h1>
          <p className="text-gray-600">
            Create and manage special events with reward multipliers
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/ads">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Back to Analytics
            </Button>
          </Link>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <Card className="p-8 col-span-2 text-center">
            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Events Yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first special event to boost user engagement!
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </Card>
        ) : (
          events.map((event) => (
            <Card 
              key={event.id} 
              className={`p-6 ${
                event.active 
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{event.name}</h3>
                    {event.active ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold mb-3">
                    <TrendingUp className="w-4 h-4" />
                    {event.multiplier}× Multiplier
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Starts: {new Date(event.startsAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Ends: {new Date(event.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleEvent(event.id, event.active)}
                  variant="outline"
                  className="flex-1"
                >
                  {event.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => deleteEvent(event.id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-600" />
                Create Special Event
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Weekend Bonus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  rows={3}
                  placeholder="Event description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reward Multiplier
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.5"
                    max="5"
                    step="0.5"
                    value={formData.multiplier}
                    onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="font-bold text-2xl text-purple-600 w-16">
                    {formData.multiplier}×
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={createEvent}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!formData.name || !formData.startDate || !formData.endDate}
              >
                Create Event
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
