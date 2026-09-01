@component('emails.layout', [
    'title' => 'Your appointment is confirmed',
    'heading' => 'Your appointment is confirmed',
    'greeting' => 'Hi ' . $patientName . ',',
    'details' => $details,
    'statusColor' => '#e3f4ec',
    'statusTextColor' => '#177245',
    'actionUrl' => $dashboardUrl ?? null,
    'actionText' => 'View appointment',
])
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#5b6777;">
        Great news — your appointment has been <strong>confirmed</strong>. We look forward to seeing you at the clinic.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#5b6777;">
        A reminder of your confirmed booking:
    </p>
@endcomponent
