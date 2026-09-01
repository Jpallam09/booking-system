<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f8fa;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#252f3d;">
    <center style="width:100%;table-layout:fixed;background-color:#f7f8fa;padding:24px 0;">
        <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #eceff3;border-radius:12px;overflow:hidden;">
            <!-- Header -->
            <div style="padding:28px 32px;border-bottom:1px solid #eceff3;">
                <div style="font-family:'Plus Jakarta Sans',Inter,-apple-system,Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#1d2633;letter-spacing:-0.01em;">
                    Lumina Dental
                </div>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
                <h1 style="margin:0 0 8px 0;font-family:'Plus Jakarta Sans',Inter,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;line-height:1.3;color:#1d2633;letter-spacing:-0.01em;">
                    {{ $heading }}
                </h1>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#5b6777;">
                    {{ $greeting }}
                </p>

                {{ $slot }}

                <!-- Details card -->
                <div style="background-color:#f7f8fa;border:1px solid #eceff3;border-radius:10px;padding:20px 24px;margin-top:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="padding:6px 0;font-size:13px;color:#8a94a3;">Service</td>
                            <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2633;text-align:right;">{{ $details['service'] ?? '—' }}</td>
                        </tr>
                        <tr>
                            <td style="padding:6px 0;font-size:13px;color:#8a94a3;">Dentist</td>
                            <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2633;text-align:right;">{{ $details['dentist'] ?? 'To be assigned' }}</td>
                        </tr>
                        <tr>
                            <td style="padding:6px 0;font-size:13px;color:#8a94a3;">Date</td>
                            <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2633;text-align:right;">{{ $details['date'] ?? '—' }}</td>
                        </tr>
                        <tr>
                            <td style="padding:6px 0;font-size:13px;color:#8a94a3;">Status</td>
                            <td style="padding:6px 0;text-align:right;">
                                <span style="display:inline-block;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;background-color:{{ $statusColor ?? '#eef1f4' }};color:{{ $statusTextColor ?? '#5b6777' }};">
                                    {{ $details['status'] ?? '—' }}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>

                @if(!empty($actionUrl))
                <div style="text-align:center;margin-top:24px;">
                    <a href="{{ $actionUrl }}" style="display:inline-block;background-color:#1d2633;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">
                        {{ $actionText }}
                    </a>
                </div>
                @endif
            </div>

            <!-- Footer -->
            <div style="padding:20px 32px;border-top:1px solid #eceff3;background-color:#fbfcfd;">
                <p style="margin:0;font-size:13px;color:#8a94a3;">
                    Lumina Dental · Crafting healthy smiles, one visit at a time.
                </p>
                <p style="margin:6px 0 0 0;font-size:12px;color:#a6adb8;">
                    You received this email because of activity on your Lumina Dental account.
                </p>
            </div>
        </div>
    </center>
</body>
</html>
