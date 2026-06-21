'use client';

import React from 'react';
import { RefreshCw, AlertTriangle, CreditCard } from 'lucide-react';

interface Subscription {
  name: string;
  cost: number;
  frequency: string;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
  summary: { monthly_cost: number; annual_cost: number };
  leaks: any;
}

export default function SubscriptionList({ subscriptions, summary, leaks }: SubscriptionListProps) {
  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-4 h-4 text-accent-blue" />
            <h3 className="text-sm font-semibold text-zinc-300">Detected Subscriptions</h3>
          </div>

          {subscriptions.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4">No recurring standard subscriptions identified.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {subscriptions.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-900/50 rounded-lg border border-border text-xs">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-medium">{sub.name}</span>
                  </div>
                  <span className="text-zinc-400 font-semibold">₹{sub.cost}/mo</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs">
          <div>
            <span className="text-zinc-500 block">Monthly Stack</span>
            <span className="text-sm font-bold text-foreground">₹{summary.monthly_cost}</span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 block">Annual Drag</span>
            <span className="text-sm font-bold text-accent-rose">₹{summary.annual_cost}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-accent-rose" />
            <h3 className="text-sm font-semibold text-zinc-300">Savings Leak Signals</h3>
          </div>

          <div className="space-y-3">
            {leaks.food_delivery && (
              <div className="p-3 bg-accent-rose/5 border border-accent-rose/10 rounded-lg text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-zinc-200">Food Delivery Leak</span>
                  <span className="text-accent-rose font-medium">{leaks.food_delivery.order_count} orders</span>
                </div>
                <p className="text-zinc-400 mb-2">High reliance on convenience delivery apps this cycle.</p>
                <div className="flex justify-between text-[11px] text-zinc-500 pt-1.5 border-t border-border/40">
                  <span>Monthly impact: ₹{leaks.food_delivery.monthly_impact}</span>
                  <span>Annualized: <strong className="text-accent-rose font-semibold">₹{leaks.food_delivery.estimated_annual_cost}</strong></span>
                </div>
              </div>
            )}

            {leaks.shopping_leak && (
              <div className="p-3 bg-zinc-900/50 border border-border rounded-lg text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-zinc-200">Micro-Transaction Leak</span>
                  <span className="text-zinc-400 font-medium">{leaks.shopping_leak.purchase_count} checkouts</span>
                </div>
                <p className="text-zinc-400">Frequent retail checkouts below ₹1,500 accumulating stealth costs.</p>
                <div className="text-[11px] text-zinc-500 mt-2 pt-1.5 border-t border-border/40">
                  Cumulative monthly impact: <strong className="text-foreground font-semibold">₹{leaks.shopping_leak.monthly_impact}</strong>
                </div>
              </div>
            )}

            {!leaks.food_delivery && !leaks.shopping_leak && (
              <p className="text-xs text-zinc-500 py-4">Stealth transactional outflows are currently tracking well within safety limits.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}