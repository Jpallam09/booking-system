@component('emails.layout', [
    'title' => 'Your appointment is complete',
    'heading' => 'Your appointment is complete',
    'greeting' => 'Hi ' . $patientName . ',',
    'details' => $details,
    'statusColor' => '#eef1f4',
    'statusTextColor' => '#5b6777',
])
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#5b6777;">
        Thank you for visiting Lumina Dental. Your appointment has been marked as <strong>completed</strong>.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#5b6777;">
        We hope your experience was a great one. If you have any follow-up questions, feel free to reach out to the clinic.
    </p>
@endcomponent
