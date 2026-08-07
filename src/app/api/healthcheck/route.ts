import { NextResponse } from 'next/server';
import os from 'os';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // 1. Проверка безопасности
    const authHeader = request.headers.get('authorization');
    const secret = process.env.HEALTHCHECK_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const uptime = os.uptime();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = ((usedMem / totalMem) * 100).toFixed(2);
        const loadAvg = os.loadavg().map(n => n.toFixed(2)).join(', ');

        return NextResponse.json(
            {
                status: 'ok',
                server: {
                    uptime_hours: (uptime / 3600).toFixed(2),
                    cpu_load: loadAvg,
                    memory_usage_percent: memUsage,
                    memory_free_mb: (freeMem / 1024 / 1024).toFixed(0),
                    memory_total_mb: (totalMem / 1024 / 1024).toFixed(0),
                }
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { status: 'error', message: 'Failed to retrieve server stats' },
            { status: 500 }
        );
    }
}
