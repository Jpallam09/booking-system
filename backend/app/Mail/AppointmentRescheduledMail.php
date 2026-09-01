<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduledMail extends Mailable
{
    use Queueable, SerializesModels;

    public Appointment $appointment;
    public array $details;
    public string $patientName;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
        $this->patientName = $appointment->patient?->name ?? 'there';
        $this->details = AppointmentCreatedMail::buildDetails($appointment);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your appointment has been rescheduled',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-rescheduled',
        );
    }
}
