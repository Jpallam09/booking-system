@component('emails.layout', [
    'title' => 'Your appointment request is pending',
    'heading' => 'We received your appointment request',
    'greeting' => 'Hi ' . $patientName . ',',
    'details' => $details,
    'statusColor' => '#fdf3d7',
    'statusTextColor' => '#8a6116',
])
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#5b6777;">
        Your appointment request has been received and is now <strong>pending</strong>. A member of our team will review and confirm your booking shortly.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#5b6777;">
        Here are the details of your request:
    </p>
@endcomponent
