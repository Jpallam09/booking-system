@component('emails.layout', [
    'title' => 'Your appointment was rescheduled',
    'heading' => 'Your appointment has been rescheduled',
    'greeting' => 'Hi ' . $patientName . ',',
    'details' => $details,
    'statusColor' => '#e8eefb',
    'statusTextColor' => '#2f5bb7',
])
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#5b6777;">
        Good news — your appointment has been <strong>rescheduled</strong>. The updated date and time are reflected below.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#5b6777;">
        Please note the new schedule:
    </p>
@endcomponent
