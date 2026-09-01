@component('emails.layout', [
    'title' => 'Your appointment was cancelled',
    'heading' => 'Your appointment was cancelled',
    'greeting' => 'Hi ' . $patientName . ',',
    'details' => $details,
    'statusColor' => '#fde8e8',
    'statusTextColor' => '#b3261e',
])
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#5b6777;">
        Your appointment has been <strong>cancelled</strong>.
    </p>
    @if(!empty($cancellationReason))
    <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#5b6777;">
        Reason: <em>{{ $cancellationReason }}</em>
    </p>
    @endif
    <p style="margin:0;font-size:15px;line-height:1.6;color:#5b6777;">
        If you'd like to rebook, feel free to schedule a new appointment anytime.
    </p>
@endcomponent
